/**
 * /api/inquiry — Turnstile-gated proxy in front of the Formspree endpoint.
 *
 * This copy serves toyfactoryglobal.com. Before it existed the form posted
 * straight at formspree.io/f/mkoyapvg, so the endpoint sat in the page HTML and
 * harvested bots filed 110 worthless submissions in a month. The endpoint now
 * lives in FORMSPREE_ENDPOINT and never reaches the browser.
 *
 * Lead logging on this site stays browser-side (the sendBeacon in Layout.astro
 * posts to kidstoyglobal.com/api/inquiry-log): the project has no D1 binding, so
 * the env.LEADS block below is dormant here. It is kept identical to the
 * kidstoyglobal copy so the two do not drift.
 *
 * Why this exists:
 *   1. The Formspree form ID used to sit in the page HTML, so any scraper could
 *      POST straight to it and burn the monthly submission quota. It now lives
 *      in an environment variable and never reaches the browser.
 *   2. Every submission is verified against Turnstile server-side before it is
 *      forwarded, so bots are stopped before they consume quota.
 *
 * Failure policy (deliberate, see comments in verify()):
 *   - Confirmed bad token            -> reject, nothing forwarded
 *   - Token missing / expired / dup  -> forward, tagged [unverified]
 *   - Cloudflare unreachable         -> forward (fail open)
 *   A buyer must never lose an inquiry because our infrastructure hiccuped.
 *
 * Environment variables (Cloudflare Pages -> Settings -> Variables and Secrets):
 *   TURNSTILE_SECRET     required for bot protection; if absent we fail open
 *   FORMSPREE_ENDPOINT   optional; defaults to the current form endpoint so the
 *                        endpoint can be rotated later without a code change
 */

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DEFAULT_ENDPOINT = "https://formspree.io/f/xnpdrrlg";

// Manual timeout: AbortSignal.timeout is not reliable across every Worker
// runtime version, and a thrown AbortSignal error here would look like an
// upstream failure.
async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

const THANKS_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Inquiry received - Toy Factory</title>
<style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f8fafc;color:#0f172a;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
.card{background:#fff;border-radius:24px;padding:40px 32px;max-width:520px;box-shadow:0 20px 50px rgba(15,23,42,.08);text-align:center}
h1{font-size:24px;margin:0 0 12px}p{color:#475569;line-height:1.6;margin:0 0 16px}
a{color:#ea580c;font-weight:700;text-decoration:none}</style></head>
<body><div class="card">
<h1>Inquiry received — thank you.</h1>
<p>We reply within one business day. Including a model number and a target quantity gets you a priced answer faster.</p>
<p><a href="https://toyfactoryglobal.com/">Back to toyfactoryglobal.com</a></p>
</div></body></html>`;

const FAIL_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Could not send - Toy Factory</title>
<style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f8fafc;color:#0f172a;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
.card{background:#fff;border-radius:24px;padding:40px 32px;max-width:520px;box-shadow:0 20px 50px rgba(15,23,42,.08)}
h1{font-size:22px;margin:0 0 12px}p{color:#475569;line-height:1.6;margin:0 0 16px}
a{color:#ea580c;font-weight:700}</style></head>
<body><div class="card">
<h1>We could not send that form.</h1>
<p>Your text is still in the browser — go back and copy it, then send it either way below. Both reach the same inbox.</p>
<p><a href="https://wa.me/8615976917707">WhatsApp +86 159 7691 7707</a><br>
<a href="mailto:hntoys7@sinuotoys.com">hntoys7@sinuotoys.com</a></p>
</div></body></html>`;

/*
 * ---------------------------------------------------------------------------
 * Proof-of-page-load tickets
 * ---------------------------------------------------------------------------
 * Turnstile alone does not stop a script that POSTs to this URL directly: a
 * tokenless request never reaches siteverify (see handle()), so it is forwarded
 * as "unverified" by design. Every spam submission in Nov 2026 used exactly that
 * path — the giveaway was a missing _subject, which only a hand-rolled POST
 * omits.
 *
 * A ticket is a short string the page fetches from this same endpoint on load:
 *
 *     GET /api/inquiry  ->  { ok: true, t: <unix seconds>, sig: <hmac hex> }
 *     sig = HMAC-SHA256(secret, "ticket-v1|<t>|<client ip>")
 *
 * It binds to the caller's IP, so it cannot be minted elsewhere and replayed
 * from a different host, and it expires. Crucially it is issued by our own
 * origin — no third-party domain — so a buyer behind a corporate network that
 * blocks challenges.cloudflare.com still gets one. That is the case the old
 * fail-open was protecting, and it keeps working.
 *
 * A request without a valid ticket is rejected only when it is an XHR/fetch
 * style call (Accept: application/json). A native form post (Accept: text/html,
 * i.e. JavaScript disabled or broken) is still forwarded and tagged [no-js],
 * because that is a plausible human.
 */

const TICKET_LABEL = "inquiry-ticket-v1";
const TICKET_MAX_AGE = 7200; // seconds; a slow buyer may spend two hours on an RFQ
const TICKET_SKEW = 300; // tolerate a client clock running slightly fast

function ticketSecret(env) {
  // TURNSTILE_SECRET doubles as the HMAC key so enabling this needs no new
  // dashboard variable. FORM_TICKET_SECRET wins if it is ever rotated alone.
  return env.FORM_TICKET_SECRET || env.TURNSTILE_SECRET || "";
}

async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function signTicket(secret, ip, t) {
  return hmacHex(secret, `${TICKET_LABEL}|${t}|${ip}`);
}

// Constant-time-ish compare: the values are short and the cost is nil, so there
// is no reason to leak match length through timing.
function sameString(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function ticketValid(secret, ip, rawT, sig) {
  if (!secret) return false;
  const t = Number.parseInt(String(rawT || ""), 10);
  if (!Number.isFinite(t) || t <= 0) return false;
  const now = Math.floor(Date.now() / 1000);
  if (t > now + TICKET_SKEW) return false;
  if (now - t > TICKET_MAX_AGE) return false;
  const expected = await signTicket(secret, ip, t);
  return sameString(expected, String(sig || ""));
}

/**
 * Verify a Turnstile token.
 * @returns {"pass"|"reject"|"unverified"}
 *   pass       - token is genuine
 *   reject     - token is definitely invalid; drop the submission
 *   unverified - we cannot tell (expired, replayed, Cloudflare down); forward
 *                with a tag rather than punishing a possible buyer
 */
async function verify(token, secret, ip) {
  // A 300 s token expiry plus single-use semantics mean the most common failure
  // for a human writing a long RFQ is timeout-or-duplicate, not forgery.
  const SOFT = new Set([
    "timeout-or-duplicate",
    "missing-input-response",
    "missing-input-secret",
    "invalid-input-secret",
    "internal-error",
  ]);

  let data;
  try {
    const body = new FormData();
    body.append("secret", secret);
    body.append("response", token);
    if (ip) body.append("remoteip", ip);

    const res = await fetchWithTimeout(SITEVERIFY, { method: "POST", body }, 6000);
    if (!res.ok) return "unverified";
    data = await res.json();
  } catch {
    // Network or timeout: our problem, not the buyer's.
    return "unverified";
  }

  if (data && data.success === true) return "pass";

  const codes = Array.isArray(data && data["error-codes"]) ? data["error-codes"] : [];
  for (const code of codes) {
    if (SOFT.has(code)) return "unverified";
  }
  return "reject";
}

/**
 * Write one row to the lead log (D1 binding LEADS).
 *
 * Never throws: the inquiry has already been delivered upstream by the time this
 * runs, so a storage problem must not surface to the buyer or fail the request.
 */
async function logLead(env, request, form, verdict) {
  const cut = (value, max = 2000) => {
    const s = value == null ? "" : String(value);
    return s.length > max ? s.slice(0, max) : s;
  };

  try {
    await env.LEADS.prepare(
      `INSERT INTO inquiries (ts, site, page, name, email, country, subject, message, flag, ip, ua)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        new Date().toISOString(),
        "toyfactoryglobal.com",
        cut(form.get("page_path") || ""),
        cut(form.get("name") || ""),
        cut(form.get("email") || ""),
        cut(form.get("country") || ""),
        cut(form.get("_subject") || ""),
        cut(form.get("message") || ""),
        // "unverified" is not "spam": it means the challenge could not be
        // checked. The digest shows it as 待定 rather than binning a real buyer.
        verdict === "pass" ? "real" : "unverified",
        cut(request.headers.get("CF-Connecting-IP") || ""),
        cut(request.headers.get("user-agent") || "")
      )
      .run();
  } catch {
    // Swallowed on purpose. See comment above.
  }
}

// Wrap the handler so an unexpected throw surfaces as JSON with the real
// message instead of Cloudflare's opaque "error code: 502" page.
export async function onRequestPost(context) {
  try {
    return await handle(context);
  } catch (err) {
    return json(
      { ok: false, reason: "exception", message: String((err && err.message) || err) },
      500
    );
  }
}

async function handle(context) {
  const { request, env } = context;

  const wantsHtml = (request.headers.get("accept") || "").includes("text/html");

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, reason: "bad-request" }, 400);
  }

  // Honeypot: a filled hidden field means an automated submitter. Accept it
  // silently so the bot does not retry, but never forward or count it.
  const trap = form.get("_gotcha");
  if (trap && String(trap).trim() !== "") {
    return wantsHtml ? html(THANKS_HTML) : json({ ok: true });
  }

  // Empty submissions are pure noise: they burn Formspree quota and, because
  // every real inquiry is also paired with an empty one, they doubled the row
  // count in the digest. Nothing to triage, so nothing is forwarded or stored.
  const nameV = String(form.get("name") || "").trim();
  const emailV = String(form.get("email") || "").trim();
  const msgV = String(form.get("message") || "").trim();
  if (!nameV && !emailV && !msgV) {
    return wantsHtml ? html(THANKS_HTML) : json({ ok: true });
  }

  const ip = request.headers.get("CF-Connecting-IP") || "";
  const token = String(form.get("cf-turnstile-response") || "");
  const secret = env.TURNSTILE_SECRET;
  const endpoint = env.FORMSPREE_ENDPOINT || DEFAULT_ENDPOINT;

  // Ticket gate. Without a secret we cannot sign anything, so the gate stays
  // open and the site behaves exactly as it did before this change.
  const tSecret = ticketSecret(env);
  let ticketOk = false;
  if (tSecret) {
    ticketOk = await ticketValid(
      tSecret,
      ip,
      form.get("form_ts"),
      form.get("form_sig")
    );

    if (!ticketOk) {
      // A browser running our JavaScript always has a ticket, so an XHR-style
      // call without one is a script hitting the endpoint directly: drop it
      // before it costs us quota. A native form post (Accept: text/html) is the
      // JavaScript-disabled path — that one may be a real buyer, so it goes on
      // and is tagged [no-js] below.
      if (!wantsHtml) {
        return json({ ok: false, reason: "no-ticket" }, 403);
      }
    }
  }

  let verdict = "unverified";
  if (secret && token) {
    verdict = await verify(token, secret, ip);
  }
  // No secret configured, or the widget never rendered (blocked script, JS off,
  // old browser): fail open. The submission is tagged so it can be triaged.

  if (verdict === "reject") {
    return wantsHtml
      ? html(FAIL_HTML, 400)
      : json({ ok: false, reason: "challenge" }, 400);
  }

  // Rebuild the payload, dropping the fields that are ours, not Formspree's.
  const out = new FormData();
  for (const [key, value] of form.entries()) {
    if (key === "_gotcha" || key === "cf-turnstile-response") continue;
    if (key === "form_ts" || key === "form_sig") continue;
    out.append(key, value);
  }

  // Which page the buyer was reading. The forms did not send this, so the digest
  // had a permanently blank "page" column and an inquiry could not be traced
  // back to the product it was about. Referer is the fallback for the
  // JavaScript-disabled path.
  if (!out.get("page_path")) {
    try {
      const ref = new URL(request.headers.get("referer") || "");
      if (ref.pathname) out.set("page_path", ref.pathname);
    } catch {
      // No referer: leave it blank rather than invent one.
    }
  }

  const tags = [];
  if (verdict !== "pass") tags.push("unverified");
  if (tSecret && !ticketOk) tags.push("no-js");

  if (tags.length) {
    const subject = String(out.get("_subject") || "Website inquiry");
    out.set("_subject", `${subject} [${tags.join("+")}]`);
    out.append("Turnstile", verdict);
    out.append("Ticket", ticketOk ? "ok" : "missing");
  }

  let upstream;
  try {
    upstream = await fetchWithTimeout(
      endpoint,
      { method: "POST", body: out, headers: { Accept: "application/json" } },
      15000
    );
  } catch {
    return wantsHtml
      ? html(FAIL_HTML, 502)
      : json({ ok: false, reason: "upstream-unreachable" }, 502);
  }

  if (!upstream.ok) {
    return wantsHtml
      ? html(FAIL_HTML, 502)
      : json({ ok: false, reason: "upstream", upstreamStatus: upstream.status }, 502);
  }

  // Keep our own copy of the lead when this project has the LEADS binding. On
  // toyfactoryglobal.com it does not: the sendBeacon in Layout.astro writes the
  // row to kidstoyglobal.com/api/inquiry-log instead, so this block is dormant
  // here and the beacon is the only path.
  //
  // Fire-and-forget: a storage failure must not turn a delivered inquiry into an
  // error page for the buyer.
  if (env.LEADS) {
    const write = logLead(env, request, form, verdict);
    if (typeof context.waitUntil === "function") context.waitUntil(write);
    else await write;
  }

  return wantsHtml ? html(THANKS_HTML) : json({ ok: true });
}

// GET issues a proof-of-page-load ticket (see the ticket block above). The form
// fetches one when the page loads and returns it with the submission.
export async function onRequestGet(context) {
  const secret = ticketSecret((context && context.env) || {});

  // No key configured: say so explicitly so the form can submit the old way
  // instead of sending something the server is going to reject.
  if (!secret) return json({ ok: true, ticket: false });

  const ip = (context.request.headers.get("CF-Connecting-IP") || "").trim();
  const t = Math.floor(Date.now() / 1000);

  try {
    const sig = await signTicket(secret, ip, t);
    return json({ ok: true, ticket: true, t, sig });
  } catch (err) {
    return json({ ok: false, reason: "ticket-failed" }, 500);
  }
}

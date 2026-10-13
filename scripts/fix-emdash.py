# -*- coding: utf-8 -*-
"""
Fix the "--?" corruption in blog pages.

Root cause: a previous "encoding fix" (commit bb311e0) replaced the damaged
byte sequence with a literal em dash but left a trailing "?", and it had
already eaten the following character. So every occurrence of "--?" originally
held TWO characters: an en/em dash PLUS the char that followed it.

Order matters: specific numeric ranges first, generic prose last.
"""
import pathlib
import sys

SRC = pathlib.Path(__file__).resolve().parent.parent / "src"

BROKEN = "\u2014?"          # em dash + literal question mark

# (broken, restored) -- most specific first
RULES = [
    # --- broken HTML tag: ">" + em dash  ->  the "<" of </span> was eaten
    (f"{BROKEN}/span>", "</span>"),
    (f"{BROKEN}/a>", "</a>"),

    # --- numeric ranges: "36--72", "35--157", "158--525"
    (f"36{BROKEN}2 units", "36\u201372 units"),
    (f"Tier 1: 35{BROKEN}57 Units", "Tier 1: 35\u2013157 Units"),
    (f"Tier 2: 158{BROKEN}25 Units", "Tier 2: 158\u2013525 Units"),

    # --- price ranges
    (f"$4{BROKEN}25 factory cost range", "$4\u2013$25 factory cost range"),
    (f"$19.99{BROKEN}29.99", "$19.99\u2013$29.99"),
    (f"$49.99{BROKEN}69.99", "$49.99\u2013$69.99"),
    (f"$34.99{BROKEN}44.99", "$34.99\u2013$44.99"),
]

TARGETS = sorted(SRC.rglob("*.astro"))


def main() -> int:
    total = 0
    for path in TARGETS:
        raw = path.read_bytes()
        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError:
            continue
        if BROKEN not in text:
            continue

        original = text
        hits = []

        for bad, good in RULES:
            n = text.count(bad)
            if n:
                text = text.replace(bad, good)
                hits.append((bad, good, n))

        # generic fallback: em dash + eaten character -> em dash + space
        n = text.count(BROKEN)
        if n:
            text = text.replace(BROKEN, "\u2014 ")  # em dash + space
            hits.append((BROKEN, "\u2014 ", n))

        if text != original:
            remaining = text.count(BROKEN)
            path.write_bytes(text.encode("utf-8"))
            total += sum(h[2] for h in hits)
            print(f"[FIXED] {path.relative_to(SRC)}")
            for bad, good, n in hits:
                print(f"        {n:>2}x  {bad!r} -> {good!r}")
            if remaining:
                print(f"        !! {remaining} still broken")

    print(f"\nTotal replacements: {total}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

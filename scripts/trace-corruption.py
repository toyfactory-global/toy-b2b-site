# -*- coding: utf-8 -*-
"""Trace which commit introduced the mojibake, using ASCII-only output.

Prints raw byte hex + codepoint hex so nothing depends on console encoding.
"""
import subprocess

PATH = "src/pages/blog/bubble-machine-buyer-guide.astro"
REVS = ["305c0d7", "6763c08", "bb311e0", "HEAD"]
ANCHOR = b"Tier 1: 35"


def blob(rev: str) -> bytes:
    return subprocess.run(["git", "show", f"{rev}:{PATH}"], capture_output=True).stdout


def probe(rev: str) -> None:
    raw = blob(rev)
    if not raw:
        print(f"{rev}: no content")
        return
    try:
        raw.decode("utf-8")
        ok = "valid-utf8"
    except UnicodeDecodeError as exc:
        ok = f"INVALID-utf8 @byte{exc.start}"

    idx = raw.find(ANCHOR)
    print(f"{rev}: {len(raw)} bytes, {ok}")
    if idx < 0:
        print("   anchor not found")
        return
    window = raw[idx : idx + 16]
    print(f"   bytes : {' '.join(f'{b:02x}' for b in window)}")
    # decode the window leniently to show what the codepoints are
    text = window.decode("utf-8", errors="replace")
    print(f"   codepoints: {' '.join(f'U+{ord(c):04X}' for c in text)}")


for rev in REVS:
    probe(rev)
    print()

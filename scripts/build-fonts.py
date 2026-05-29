#!/usr/bin/env python3
"""Subset + self-host the web fonts used on the page.

Reads the actual text from index.html, builds a glyph set (used glyphs plus
full kana + ASCII + common punctuation for edit-resilience), and subsets each
variable font to a tiny woff2 that keeps the weight axis. Output -> assets/fonts/.

Prereqs (local only):  pip install fonttools brotli
Source fonts are downloaded to /tmp/fontsrc by scripts/fetch-font-src.sh.
"""
import html.parser, os, pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"
OUT = ROOT / "assets" / "fonts"
SRC = pathlib.Path("/tmp/fontsrc")


class TextOnly(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.buf = []

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style") and self.skip:
            self.skip -= 1

    def handle_data(self, data):
        if not self.skip:
            self.buf.append(data)


def rng(a, b):
    return {chr(c) for c in range(a, b + 1)}


def main():
    parser = TextOnly()
    parser.feed(HTML.read_text(encoding="utf-8"))
    chars = set("".join(parser.buf))

    # Strings injected via CSS ::before / decorative markup not in text nodes
    chars |= set("OURSSCROLL→＋©")
    # Safety ranges so future copy edits don't fall back to system fonts
    chars |= rng(0x20, 0x7E)            # ASCII printable
    chars |= rng(0x3040, 0x309F)        # hiragana
    chars |= rng(0x30A0, 0x30FF)        # katakana
    chars |= rng(0xFF01, 0xFF60)        # fullwidth forms
    chars |= set("、。，．・：；！？「」『』（）〔〕［］｛｝〜ー―“”‘’％＆＋－×／　〒℡№")

    for ws in "\n\r\t":
        chars.discard(ws)
    chars = {c for c in chars if ord(c) >= 0x20}

    glyph_file = pathlib.Path("/tmp/glyphs.txt")
    glyph_file.write_text("".join(sorted(chars)), encoding="utf-8")
    print(f"unique glyphs: {len(chars)}")

    OUT.mkdir(parents=True, exist_ok=True)
    base_feat = "calt,ccmp,kern,liga,clig,locl,mark,mkmk,rlig,dlig"
    jobs = [
        ("NotoSansJP.ttf", "NotoSansJP-subset.woff2", base_feat + ",palt,vpal,halt"),
        ("Inter.ttf", "Inter-subset.woff2", base_feat + ",tnum,ss01"),
        ("JetBrainsMono.ttf", "JetBrainsMono-subset.woff2", base_feat),
    ]

    total = 0
    for src_name, out_name, feats in jobs:
        src = SRC / src_name
        if not src.exists():
            sys.exit(f"missing source font {src} — run scripts/fetch-font-src.sh first")
        out = OUT / out_name
        subprocess.run([
            sys.executable, "-m", "fontTools.subset", str(src),
            "--text-file=/tmp/glyphs.txt",
            "--flavor=woff2",
            f"--output-file={out}",
            f"--layout-features={feats}",
            "--drop-tables+=DSIG",
        ], check=True)
        kb = out.stat().st_size / 1024
        total += kb
        print(f"  {out_name:32s} {kb:7.1f} KB")
    print(f"total woff2: {total:.1f} KB")


if __name__ == "__main__":
    main()

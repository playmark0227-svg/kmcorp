#!/usr/bin/env bash
# Download the upstream variable fonts (OFL) used as subsetting sources.
# Output -> /tmp/fontsrc (transient; not committed). Then run build-fonts.py.
set -euo pipefail
DEST="/tmp/fontsrc"
mkdir -p "$DEST"

dl() { curl -fsSL --max-time 120 -o "$DEST/$1" "$2" && echo "fetched $1"; }

dl NotoSansJP.ttf    "https://github.com/google/fonts/raw/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf"
dl Inter.ttf         "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf"
dl JetBrainsMono.ttf "https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"

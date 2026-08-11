#!/usr/bin/env bash
# Rebuild the editor guide PDF from admin-guide.src.html.
#
# The guide is set in the site's own faces (Unbounded + Inter Tight). Rather
# than fetch them at print time, we inline the very woff2 subsets the built
# site already ships, so the HTML is self-contained and the PDF embeds real
# Cyrillic glyphs instead of falling back to a system font.
#
# Usage:  npm run build && docs/build-guide.sh

set -euo pipefail
cd "$(dirname "$0")/.."

MEDIA="out/_next/static/media"
[ -d "$MEDIA" ] || { echo "Run 'npm run build' first: $MEDIA is missing."; exit 1; }

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Google Chrome not found at $CHROME"; exit 1; }

python3 - <<'PY'
import base64, pathlib, re

media = pathlib.Path("out/_next/static/media")
css = pathlib.Path("out/_next/static/css")

# Find each family's Cyrillic and Latin subset by unicode-range, so a rebuild
# that rehashes the filenames still resolves correctly.
faces = {}
for sheet in css.glob("*.css"):
    for rule in re.findall(r"@font-face\{[^}]*\}", sheet.read_text()):
        fam = re.search(r"font-family:([^;]+)", rule)
        src = re.search(r"url\(([^)]+)\)", rule)
        rng = re.search(r"unicode-range:([^;}]+)", rule)
        if not (fam and src and rng):
            continue
        name = fam.group(1).strip().lstrip("_").split("_")[0]
        kind = "cyr" if "0400-045f" in rng.group(1) else ("lat" if "u+00??" in rng.group(1) else None)
        if kind:
            faces[(name, kind)] = (src.group(1).split("/")[-1], rng.group(1))

CYR = "u+0301,u+0400-045f,u+0490-0491,u+04b0-04b1,u+2116"
LAT = ("u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,"
       "u+2000-206f,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd")

out = []
for family, source in (("Unbounded", "Unbounded"), ("InterTight", "Inter")):
    for kind, rng in (("cyr", CYR), ("lat", LAT)):
        fname, _ = faces[(source, kind)]
        b64 = base64.b64encode((media / fname).read_bytes()).decode()
        out.append(
            f'@font-face{{font-family:"{family}";font-style:normal;font-weight:300 700;'
            f'font-display:block;src:url(data:font/woff2;base64,{b64}) format("woff2");'
            f'unicode-range:{rng};}}'
        )

src = pathlib.Path("docs/admin-guide.src.html").read_text()
if "/* FONTS_PLACEHOLDER */" not in src:
    raise SystemExit("admin-guide.src.html lost its FONTS_PLACEHOLDER marker")
pathlib.Path("docs/admin-guide.html").write_text(src.replace("/* FONTS_PLACEHOLDER */", "\n".join(out)))
print("docs/admin-guide.html written")
PY

PDF="docs/ShoSho Trip - панель контенту.pdf"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=15000 \
  --print-to-pdf="$PDF" "file://$PWD/docs/admin-guide.html" 2>/dev/null

echo "$PDF"
command -v pdfinfo >/dev/null && pdfinfo "$PDF" | grep -E "^Pages|^Page size"

"""Extract Figure 1 as vector paths, including its shared legend.

Requires Poppler's pdftocairo. The crop excludes the page header and caption.
"""
from pathlib import Path
import subprocess
import tempfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")

with tempfile.TemporaryDirectory() as directory:
    output = Path(directory) / "figure-1.svg"
    subprocess.run([
        "pdftocairo", "-f", "2", "-l", "2", "-svg",
        str(ROOT / "public/paretosaddler.pdf"), str(output),
    ], check=True)
    original = ET.parse(output).getroot()
    original.set("viewBox", "106 80 400 177")
    original.set("width", "1200")
    original.set("height", "531")
    title = ET.Element(f"{{{SVG}}}title")
    title.text = "Quality–cost optimization on ClawMark and GAIA2"
    original.insert(0, title)
    ET.ElementTree(original).write(
        ROOT / "public/figures/quality-cost-frontiers.svg",
        encoding="utf-8", xml_declaration=True,
    )

print("Extracted the vector development quality–cost figure.")

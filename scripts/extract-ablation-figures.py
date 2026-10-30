"""Extract the original RQ1–RQ3 figures as vector SVGs using Poppler.

Crop coordinates are in PDF points. Captions and surrounding page content are
excluded; axes, legends, annotations, and the gate-comparison inset are retained.
"""
from pathlib import Path
import subprocess
import tempfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")

FIGURES = [
    (8, (330, 475, 174, 140), "ablation-local-gates.svg",
     "ClawMark optimization under Pareto and MinCost local promotion gates"),
    (18, (230, 442, 162, 158), "ablation-repeated-executions.svg",
     "Run-to-run quality and cost variability on four ClawMark tasks"),
    (20, (211, 453, 192, 140), "ablation-promotion-threshold.svg",
     "Retrospective sensitivity to the promotion threshold on ClawMark and GAIA2"),
]

with tempfile.TemporaryDirectory() as directory:
    for page, crop, name, description in FIGURES:
        source = Path(directory) / name
        subprocess.run([
            "pdftocairo", "-f", str(page), "-l", str(page), "-svg",
            str(ROOT / "public/paretosaddler.pdf"), str(source),
        ], check=True)
        original = ET.parse(source).getroot()
        if original.findall(f".//{{{SVG}}}image"):
            raise ValueError(f"{name} contains a raster image")
        original.set("viewBox", " ".join(map(str, crop)))
        original.set("width", str(crop[2] * 6))
        original.set("height", str(crop[3] * 6))
        title = ET.Element(f"{{{SVG}}}title")
        title.text = description
        original.insert(0, title)
        ET.ElementTree(original).write(
            ROOT / "public/figures" / name,
            encoding="utf-8", xml_declaration=True,
        )
        print(f"Extracted {name} from page {page}.")

"""Extract the original method SVG and digitize Appendix H's vector chart points.

Requires Poppler (pdftocairo). No raster rendering or Python packages are needed.
Chart coordinates are estimates recovered from the plotted PDF geometry, not raw logs.
"""
import json
import re
import subprocess
import tempfile
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SVG = "http://www.w3.org/2000/svg"
XLINK = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG)
ET.register_namespace("xlink", XLINK)


def convert(page, directory):
    path = Path(directory) / f"page-{page}.svg"
    subprocess.run(["pdftocairo", "-f", str(page), "-l", str(page), "-svg",
                    str(ROOT / "public/paretosaddler.pdf"), str(path)], check=True)
    return ET.parse(path).getroot()


with tempfile.TemporaryDirectory() as directory:
    original = convert(5, directory)
    # PDF text is overlaid outside the figure's background group. Crop the full
    # vector page, preserving its glyph outlines as well as paths and icons.
    original.set("viewBox", "105 79 400 209")
    original.set("width", "1200")
    original.set("height", "627")
    title = ET.Element(f"{{{SVG}}}title")
    title.text = "ParetoSaddler method overview — original paper Figure 2"
    original.insert(0, title)
    ET.ElementTree(original).write(ROOT / "public/figures/method-overview.svg", encoding="utf-8", xml_declaration=True)

    configurations = {
        "cm": (22, [1, 3, 4, 6, 7, 10, 11, 15, 16], [8, 9, 17]),
        "gaia": (23, [1, 4, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 22, 23], [2, 19, 21, 24, 25]),
    }
    recovered = {}
    for benchmark, (page, continued, other) in configurations.items():
        original = convert(page, directory)
        figure = next(node for node in original.iter() if node.get("id") == "source-5")
        points = {}
        for prefix, iterations, radius in [("rgb(9.019", continued, 3), ("rgb(79.606", other, 2.7), ("rgb(47.058", [0], 0)]:
            markers = [node for node in figure.iter() if node.tag.endswith("path") and node.get("fill", "").startswith(prefix)]
            assert len(markers) == len(iterations), "Unexpected PDF figure structure"
            for iteration, marker in zip(iterations, markers):
                values = list(map(float, re.findall(r"-?\d+\.?\d*", marker.get("d"))))
                x, y = values[0], values[1] + radius
                if iteration == 0:
                    x, y = sum(values[:20:2]) / 10, sum(values[1:20:2]) / 10
                if benchmark == "cm":
                    cost = .8 + (x - 72.865905) / (182.886101 - 72.865905) * .2
                    quality = 65 + (y - 67.208955) / (126.602294 - 67.208955) * 3
                else:
                    cost = .2 + (x - 54.692162) / (116.908232 - 54.692162) * .1
                    quality = 50 + (y - 50.586907) / (105.268331 - 50.586907) * 3
                    # GAIA2 has 65 tasks × 3 binary-success rollouts on development.
                    quality = round(quality / (100 / 195)) * (100 / 195)
                points[str(iteration)] = {"quality": round(quality, 2), "cost": round(cost, 3)}
        recovered[benchmark] = points
    (ROOT / "src/data/trajectory-coordinates.json").write_text(json.dumps(recovered, indent=2) + "\n")
print("Extracted original vector method figure and Appendix H chart coordinates.")

/** Keep SVG text comparable in screen pixels across differently sized viewBoxes. */
export function observeChartTypography(
  svg: SVGSVGElement,
  options: {
    compactAxis?: { x: number; y: number };
    onChange?: () => void;
  } = {},
) {
  const axis = options.compactAxis
    ? svg.querySelector<SVGTextElement>("text[transform]")
    : null;
  const originalTransform = axis?.getAttribute("transform");
  let previous = "";
  const sync = () => {
    const box = svg.getBoundingClientRect();
    const view = svg.viewBox.baseVal;
    if (!box.width || !box.height || !view.width || !view.height) return;
    const scale = Math.min(box.width / view.width, box.height / view.height);
    const mobile = matchMedia("(max-width: 760px)").matches;
    // Cap enlargement on small charts to keep labels inside the plotting margins.
    const ticks = Math.min(34, (mobile ? 12 : 14) / scale).toFixed(2);
    const labels = Math.min(30, (mobile ? 11 : 12) / scale).toFixed(2);
    const compact = scale < 0.65;
    const signature = `${ticks}/${labels}/${compact}`;
    if (signature === previous) return;
    previous = signature;
    svg.style.setProperty("--chart-tick-size", `${ticks}px`);
    svg.style.setProperty("--chart-label-size", `${labels}px`);
    if (axis && options.compactAxis && originalTransform) {
      const { x, y } = options.compactAxis;
      axis.setAttribute(
        "transform",
        compact ? `translate(${x} ${y}) rotate(-90)` : originalTransform,
      );
    }
    options.onChange?.();
  };
  const size = new ResizeObserver(sync);
  size.observe(svg);
  const view = new MutationObserver(sync);
  view.observe(svg, { attributes: true, attributeFilter: ["viewBox"] });
  window.addEventListener("resize", sync, { passive: true });
  document.fonts.ready.then(sync);
  sync();
}

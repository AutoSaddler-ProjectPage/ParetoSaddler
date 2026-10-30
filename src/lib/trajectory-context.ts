import { trajectories } from "../data/trajectories";

const element = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
) => {
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs))
    n.setAttribute(key, String(value));
  return n;
};

/** A linked overview: fixed full-run coordinates, with the detail viewport outlined. */
export function createTrajectoryContext(
  svg: SVGSVGElement,
  onOpen: () => void,
) {
  const group = element("g", {
    "data-map-context": "",
    class: "trajectory-context",
    visibility: "hidden",
    role: "button",
    tabindex: -1,
    "aria-hidden": "true",
    "aria-label": "Show the full GAIA2 optimization trajectory",
  });
  // SVG descendants can override inherited visibility. Display gates the whole inset.
  group.style.display = "none";
  group.append(
    element("rect", {
      x: 562,
      y: 80,
      width: 144,
      height: 104,
      rx: 5,
      class: "context-field",
    }),
  );
  const title = element("text", { x: 573, y: 96, class: "context-title" });
  title.textContent = "SHOW FULL RUN ↗";
  group.append(title);
  const content = element("g", { "aria-hidden": "true" });
  group.append(content);
  const frame = element("rect", { class: "context-window", rx: 1 });
  group.append(frame);
  const run = trajectories.gaia;
  const x = (cost: number) =>
    574 + ((cost - run.xDomain[0]) / (run.xDomain[1] - run.xDomain[0])) * 120;
  const y = (quality: number) =>
    173 - ((quality - run.yDomain[0]) / (run.yDomain[1] - run.yDomain[0])) * 64;
  const points = new Map<number, SVGCircleElement>();
  const edges = new Map<number, SVGPathElement>();
  for (const step of run.steps) {
    if (step.cost === null || step.quality === null) continue;
    if (step.continuedFrom !== null) {
      const parent = run.steps[step.continuedFrom];
      const path = element("path", {
        d: `M${x(parent.cost!)} ${y(parent.quality!)}L${x(step.cost)} ${y(step.quality)}`,
        class: "context-edge",
        "data-context-edge": step.iteration,
        visibility: "hidden",
      });
      content.append(path);
      edges.set(step.iteration, path);
    }
    const point = element("circle", {
      cx: x(step.cost),
      cy: y(step.quality),
      r: 1.6,
      class: "context-point",
      "data-context-point": step.iteration,
      visibility: "hidden",
    });
    content.append(point);
    points.set(step.iteration, point);
  }
  const open = () => {
    if (group.getAttribute("aria-hidden") === "false") onOpen();
  };
  group.addEventListener("click", open);
  group.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
  svg.append(group);
  return {
    hide() {
      group.style.display = "none";
      group.style.opacity = "0";
      group.style.pointerEvents = "none";
      group.setAttribute("visibility", "hidden");
      group.setAttribute("aria-hidden", "true");
      group.setAttribute("tabindex", "-1");
    },
    render(
      cursor: number,
      selected: string,
      zoom: number,
      xd: number[],
      yd: number[],
      pointReveal: number,
      edgeReveal: number,
    ) {
      const alpha = Math.max(0, Math.min(1, (zoom - 0.2) / 0.4));
      group.style.display = alpha > 0 ? "" : "none";
      group.setAttribute("visibility", alpha > 0 ? "visible" : "hidden");
      group.style.opacity = String(alpha);
      group.style.pointerEvents = alpha > 0.8 ? "auto" : "none";
      group.setAttribute("aria-hidden", String(alpha <= 0.8));
      group.setAttribute("tabindex", alpha > 0.8 ? "0" : "-1");
      const completed = Math.floor(cursor);
      for (const [id, point] of points) {
        const opacity =
          id <= completed ? 1 : id === completed + 1 ? pointReveal : 0;
        point.setAttribute("visibility", opacity > 0 ? "visible" : "hidden");
        point.style.opacity = String(opacity);
        point.classList.toggle("is-selected", String(id) === selected);
      }
      for (const [id, path] of edges) {
        const opacity =
          id <= completed ? 1 : id === completed + 1 ? edgeReveal : 0;
        path.setAttribute("visibility", opacity > 0 ? "visible" : "hidden");
        path.style.opacity = String(opacity * 0.55);
      }
      const left = x(xd[0]),
        right = x(xd[1]),
        top = y(yd[1]),
        bottom = y(yd[0]);
      frame.setAttribute("x", String(left));
      frame.setAttribute("y", String(top));
      frame.setAttribute("width", String(right - left));
      frame.setAttribute("height", String(bottom - top));
    },
  };
}

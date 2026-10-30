import { createTrajectoryContext } from "./trajectory-context";
import {
  trajectories,
  frontierAt,
  type TrajectoryBenchmark,
} from "../data/trajectories";
import { placeTrajectoryLabels, type LabelBox } from "./trajectory-labels";

const node = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs))
    element.setAttribute(key, String(value));
  return element;
};
const name = (iteration: number) => (iteration ? `I-${iteration}` : "Initial");
export function createScrollTrajectoryPlot(
  svg: SVGSVGElement,
  onSelect: (id: string) => void,
  onOpenOverview: () => void,
) {
  let benchmark: TrajectoryBenchmark = "cm";
  let points = new Map<string, SVGGElement>();
  let edges = new Map<number, SVGPathElement>();
  let edgeLengths = new Map<number, number>();
  let layoutKey = "";
  let camera = -1;
  let xDomain: number[] = [0, 1],
    yDomain: number[] = [0, 1];
  const ticks: {
    group: SVGGElement;
    line: SVGLineElement;
    label: SVGTextElement;
    value: number;
    axis: "x" | "y";
    family: "full" | "detail";
    shared: boolean;
  }[] = [];
  const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
  const ease = (value: number) => {
    const t = clamp01(value);
    return t * t * (3 - 2 * t);
  };
  type LabelState = {
    group: SVGGElement;
    rect: SVGRectElement;
    text: SVGTextElement;
    leader: SVGPathElement;
    width: number;
    height: number;
    selected: boolean;
    anchor: { x: number; y: number };
    box: LabelBox | null;
    goal: LabelBox | null;
  };
  const labels = new Map<number, LabelState>();
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let measurementsDirty = true;
  let labelsMoving = false;
  let lastLabelTime = 0;
  const arrowId = "scroll-refinement-arrow";
  const activeArrowId = "scroll-refinement-arrow-active";
  const arrowDefinitions = node("defs", {});
  for (const [id, color] of [
    [arrowId, "var(--j-edge)"],
    [activeArrowId, "var(--j-green)"],
  ]) {
    const marker = node("marker", {
      id,
      viewBox: "0 -4 9 8",
      refX: 8,
      refY: 0,
      markerWidth: 9,
      markerHeight: 8,
      markerUnits: "userSpaceOnUse",
      orient: "auto",
    });
    marker.append(node("path", { d: "M0 -3.5L8 0L0 3.5L1.7 0Z", fill: color }));
    arrowDefinitions.append(marker);
  }
  const clip = node("clipPath", { id: "scroll-trajectory-field" });
  clip.append(node("rect", { x: 82, y: 66, width: 634, height: 356 }));
  arrowDefinitions.append(clip);
  svg.prepend(arrowDefinitions);
  // Keep arrow tips outside the actual markers; bend very short refinements
  // so close candidates stay at their true coordinates and remain distinguishable.
  const refinementPath = (ax: number, ay: number, bx: number, by: number) => {
    const distance = Math.hypot(bx - ax, by - ay);
    if (distance < 42) {
      const ux = distance > 0.01 ? (bx - ax) / distance : 1;
      const uy = distance > 0.01 ? (by - ay) / distance : 0;
      const cx = (ax + bx) / 2 - uy * 34,
        cy = (ay + by) / 2 + ux * 34;
      const fromLength = Math.hypot(cx - ax, cy - ay) || 1;
      const toLength = Math.hypot(cx - bx, cy - by) || 1;
      return `M${ax + ((cx - ax) / fromLength) * 9} ${ay + ((cy - ay) / fromLength) * 9}Q${cx} ${cy} ${bx + ((cx - bx) / toLength) * 14} ${by + ((cy - by) / toLength) * 14}`;
    }
    const ux = (bx - ax) / distance,
      uy = (by - ay) / distance;
    return `M${ax + ux * 9} ${ay + uy * 9}L${bx - ux * 14} ${by - uy * 14}`;
  };
  const layer = (part: string) =>
    svg.querySelector<SVGGElement>(`[data-map-${part}]`)!;
  const travelingLayer = node("g", {
    "data-map-arrowheads": "",
    "aria-hidden": "true",
  });
  const travelingArrow = node("path", {
    d: "M-8 -3.5L0 0L-8 3.5L-6.3 0Z",
    class: "map-traveling-arrow",
    visibility: "hidden",
  });
  travelingLayer.append(travelingArrow);
  layer("edges").after(travelingLayer);
  for (const part of ["edges", "points", "frontier", "next-frontier"])
    layer(part).setAttribute("clip-path", "url(#scroll-trajectory-field)");
  travelingLayer.setAttribute("clip-path", "url(#scroll-trajectory-field)");
  const context = createTrajectoryContext(svg, onOpenOverview);
  const inView = (cost: number, quality: number) =>
    x(cost) >= 84 && x(cost) <= 714 && y(quality) >= 68 && y(quality) <= 420;
  let x = (value: number) => value;
  let y = (value: number) => value;
  const configure = (nextBenchmark: TrajectoryBenchmark) => {
    benchmark = nextBenchmark;
    const run = trajectories[benchmark];
    xDomain = [...run.xDomain];
    yDomain = [...run.yDomain];
    x = (value) =>
      84 + ((value - xDomain[0]) / (xDomain[1] - xDomain[0])) * 630;
    y = (value) =>
      420 - ((value - yDomain[0]) / (yDomain[1] - yDomain[0])) * 352;
    camera = -1;
    ticks.length = 0;
    context.hide();
    svg.dataset.benchmark = benchmark;
    points = new Map();
    edges = new Map();
    edgeLengths = new Map();
    layoutKey = "";
    travelingArrow.setAttribute("visibility", "hidden");
    labels.clear();
    measurementsDirty = true;
    labelsMoving = false;
    lastLabelTime = 0;
    for (const part of ["grid", "edges", "points", "labels", "leaders"])
      layer(part).replaceChildren();
    layer("frontier").setAttribute("d", "");
    layer("next-frontier").setAttribute("d", "");
    const detailX = [0.35, 0.36, 0.37, 0.38, 0.39, 0.4, 0.41],
      detailY = [54, 56, 58, 60, 62];
    const addTicks = (
      values: readonly number[],
      axis: "x" | "y",
      family: "full" | "detail",
    ) => {
      const other = axis === "x" ? detailX : detailY;
      const originals = axis === "x" ? run.xTicks : run.yTicks;
      for (const value of values) {
        if (family === "detail" && originals.includes(value)) continue;
        const group = node("g", {}),
          line = node("line", {}),
          label = node("text", {
            "text-anchor": axis === "x" ? "middle" : "end",
          });
        group.append(line, label);
        layer("grid").append(group);
        ticks.push({
          group,
          line,
          label,
          value,
          axis,
          family,
          shared:
            benchmark === "gaia" && family === "full" && other.includes(value),
        });
      }
    };
    addTicks(run.xTicks, "x", "full");
    addTicks(run.yTicks, "y", "full");
    if (benchmark === "gaia") {
      addTicks(detailX, "x", "detail");
      addTicks(detailY, "y", "detail");
    }
    const addPoint = (
      id: string,
      px: number,
      py: number,
      title: string,
      family: string,
    ) => {
      const group = node("g", {
        transform: `translate(${px} ${py})`,
        class: `journey-map-point ${family}`,
        "data-map-point": id,
        visibility: "hidden",
        tabindex: -1,
        role: "button",
        "aria-label": title,
        "aria-pressed": "false",
        "aria-hidden": "true",
      });
      group.append(
        node("circle", { r: 22, class: "map-hit" }),
        node("circle", { r: 11, class: "map-ring" }),
        node("circle", { r: 5.5, class: "map-dot" }),
      );
      if (id === "0") {
        group.classList.add("map-initial");
        group.append(
          node("path", { d: "M0 -7L7 0L0 7L-7 0Z", class: "map-origin" }),
        );
      }
      const tooltip = node("title", {});
      const step = run.steps[Number(id)];
      tooltip.textContent = `Quality: ≈${step.quality!.toFixed(2)}%\nCost: ≈$${step.cost!.toFixed(3)}`;
      group.append(tooltip);
      group.addEventListener("click", (event) => {
        // Dense frontier markers can share hit areas. Pick the nearest center,
        // rather than whichever overlapping group happens to be last in the SVG.
        const ctm = svg.getScreenCTM();
        if (!ctm || event.detail === 0) {
          onSelect(id);
          return;
        }
        const screenPoint = svg.createSVGPoint();
        screenPoint.x = event.clientX;
        screenPoint.y = event.clientY;
        const cursor = screenPoint.matrixTransform(ctm.inverse());
        let nearest = id,
          distance = Infinity;
        for (const [candidateId, candidate] of points) {
          if (candidate.getAttribute("aria-hidden") !== "false") continue;
          const transform = candidate.transform.baseVal.consolidate()?.matrix;
          if (!transform) continue;
          const nextDistance = Math.hypot(
            cursor.x - transform.e,
            cursor.y - transform.f,
          );
          if (nextDistance < distance) {
            distance = nextDistance;
            nearest = candidateId;
          }
        }
        onSelect(nearest);
      });
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(id);
        }
      });
      layer("points").append(group);
      points.set(id, group);
      return group;
    };
    for (const step of run.steps) {
      if (step.cost === null || step.quality === null) continue;
      addPoint(
        String(step.iteration),
        x(step.cost),
        y(step.quality),
        `${name(step.iteration)}: approximately ${step.quality}% quality, $${step.cost} per task. ${step.title}`,
        "development",
      );
      if (step.continuedFrom !== null) {
        const parent = run.steps[step.continuedFrom];
        const edge = node("path", {
          d: refinementPath(
            x(parent.cost!),
            y(parent.quality!),
            x(step.cost),
            y(step.quality),
          ),
          "marker-end": `url(#${arrowId})`,
          "data-map-from": step.continuedFrom,
          visibility: "hidden",
          "data-map-edge": step.iteration,
        });
        layer("edges").append(edge);
        edges.set(step.iteration, edge);
        edgeLengths.set(step.iteration, edge.getTotalLength());
      }
    }
    svg.setAttribute(
      "aria-label",
      `${run.name} development trajectory, approximate coordinates from the appendix. Select a visible point to inspect it.`,
    );
  };
  const positionCamera = (zoom: number) => {
    if (Math.abs(camera - zoom) < 0.000001) return;
    camera = zoom;
    const run = trajectories[benchmark];
    xDomain = run.xDomain.map(
      (value, index) => value + ([0.345, 0.415][index] - value) * zoom,
    );
    yDomain = run.yDomain.map(
      (value, index) => value + ([54, 63][index] - value) * zoom,
    );
    for (const tick of ticks) {
      const { line, label, value, axis, family, shared, group } = tick;
      const position = axis === "x" ? x(value) : y(value);
      const inside =
        axis === "x"
          ? position >= 83 && position <= 715
          : position >= 67 && position <= 421;
      // Introduce 1-cent ticks only once they have enough screen space.
      const detailOpacity = axis === "x" ? ease((zoom - 0.87) / 0.13) : zoom;
      const opacity =
        family === "detail" ? detailOpacity : shared ? 1 : 1 - zoom;
      group.setAttribute(
        "visibility",
        inside && opacity > 0.001 ? "visible" : "hidden",
      );
      group.style.opacity = String(opacity);
      if (axis === "x") {
        line.setAttribute("x1", String(position));
        line.setAttribute("x2", String(position));
        line.setAttribute("y1", "68");
        line.setAttribute("y2", "420");
        label.setAttribute("x", String(position));
        label.setAttribute("y", "451");
        label.textContent = `$${value.toFixed(family === "detail" || zoom > 0.5 ? 2 : 1)}`;
      } else {
        line.setAttribute("x1", "84");
        line.setAttribute("x2", "714");
        line.setAttribute("y1", String(position));
        line.setAttribute("y2", String(position));
        label.setAttribute("x", "65");
        label.setAttribute("y", String(position + 5));
        label.textContent = String(value);
      }
    }
    for (const step of run.steps) {
      if (step.cost === null || step.quality === null) continue;
      points
        .get(String(step.iteration))!
        .setAttribute(
          "transform",
          `translate(${x(step.cost)} ${y(step.quality)})`,
        );
      const edge = edges.get(step.iteration);
      if (edge && step.continuedFrom !== null) {
        const parent = run.steps[step.continuedFrom];
        edge.setAttribute(
          "d",
          refinementPath(
            x(parent.cost!),
            y(parent.quality!),
            x(step.cost),
            y(step.quality),
          ),
        );
        edgeLengths.set(step.iteration, edge.getTotalLength());
      }
    }
    svg.dataset.zoom = zoom.toFixed(4);
  };
  const render = (cursor: number, selected: string, zoom = 0) => {
    const run = trajectories[benchmark];
    const amount = benchmark === "gaia" ? clamp01(zoom) : 0;
    const cameraChanged = Math.abs(camera - amount) >= 0.000001;
    positionCamera(amount);
    const playhead = Math.max(0, Math.min(run.proposals, cursor));
    const iteration = Math.floor(playhead);
    const incoming = Math.min(run.proposals, iteration + 1);
    const phase = iteration === run.proposals ? 0 : playhead - iteration;
    const pointReveal = ease((phase - 0.6) / 0.4);
    const edgeReveal = ease(phase / 0.8);
    svg.dataset.playhead = playhead.toFixed(4);
    const frontier = frontierAt(run.steps, iteration);
    const nextFrontier =
      pointReveal > 0 ? frontierAt(run.steps, incoming) : frontier;
    const frontierIds = new Set(frontier.map((s) => String(s.iteration)));
    const nextFrontierIds = new Set(
      nextFrontier.map((s) => String(s.iteration)),
    );
    for (const [id, point] of points) {
      const n = Number(id);
      const complete = n <= iteration;
      const alpha = complete ? 1 : n === incoming ? pointReveal : 0;
      const step = run.steps[n];
      const inside = inView(step.cost!, step.quality!);
      point.setAttribute(
        "visibility",
        alpha > 0 && inside ? "visible" : "hidden",
      );
      point.style.opacity = String(alpha);
      point.style.pointerEvents = complete && inside ? "auto" : "none";
      point.setAttribute("aria-hidden", String(!complete || !inside));
      point.setAttribute("tabindex", complete && inside ? "0" : "-1");
      point.setAttribute("aria-pressed", String(id === selected));
      point.classList.toggle("is-selected", id === selected);
      point.classList.toggle("on-frontier", frontierIds.has(id));
    }
    travelingArrow.setAttribute("visibility", "hidden");
    for (const [id, edge] of edges) {
      const reveal = id <= iteration ? 1 : id === incoming ? edgeReveal : 0;
      const length = edgeLengths.get(id)!;
      edge.setAttribute("visibility", reveal > 0 ? "visible" : "hidden");
      edge.style.strokeDasharray = `${length} ${length}`;
      edge.style.strokeDashoffset = String(length * (1 - reveal));
      const focused = String(id) === selected;
      edge.classList.toggle("is-current-edge", focused);
      edge.setAttribute(
        "marker-end",
        reveal >= 1 ? `url(#${focused ? activeArrowId : arrowId})` : "none",
      );
      if (reveal > 0 && reveal < 1) {
        const distance = length * reveal;
        const tip = edge.getPointAtLength(distance);
        const before = edge.getPointAtLength(Math.max(0, distance - 0.4));
        const after = edge.getPointAtLength(Math.min(length, distance + 0.4));
        const angle =
          (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;
        travelingArrow.setAttribute("visibility", "visible");
        travelingArrow.setAttribute(
          "transform",
          `translate(${tip.x} ${tip.y}) rotate(${angle})`,
        );
        travelingArrow.style.opacity = String(Math.min(1, reveal / 0.08));
      }
    }
    const frontierPath = (steps: typeof frontier) =>
      steps
        .map(
          (step, index) =>
            `${index ? "L" : "M"}${x(step.cost!)} ${y(step.quality!)}`,
        )
        .join(" ");
    const currentFrontierPath = frontierPath(frontier);
    const incomingFrontierPath = frontierPath(nextFrontier);
    const frontierBlend =
      currentFrontierPath === incomingFrontierPath ? 0 : pointReveal;
    layer("frontier").setAttribute("d", currentFrontierPath);
    layer("frontier").style.opacity = String(0.8 * (1 - frontierBlend));
    layer("next-frontier").setAttribute("d", incomingFrontierPath);
    layer("next-frontier").style.opacity = String(0.8 * frontierBlend);
    layer("next-frontier").setAttribute(
      "visibility",
      frontierBlend > 0 ? "visible" : "hidden",
    );
    if (benchmark === "gaia")
      context.render(
        playhead,
        selected,
        amount,
        xDomain,
        yDomain,
        pointReveal,
        edgeReveal,
      );
    else context.hide();
    const fadeLabels = () => {
      for (const part of ["labels", "leaders"]) {
        layer(part)
          .querySelectorAll<SVGElement>("[data-label-for]")
          .forEach((label) => {
            const n = Number(label.dataset.labelFor);
            let alpha = n <= iteration ? 1 : n === incoming ? pointReveal : 0;
            if (
              n !== 0 &&
              String(n) !== selected &&
              frontierIds.has(String(n)) &&
              !nextFrontierIds.has(String(n))
            )
              alpha *= 1 - pointReveal;
            label.style.opacity = String(alpha);
            label.setAttribute("visibility", alpha > 0 ? "visible" : "hidden");
          });
      }
    };
    const nextLayout = `${iteration}-${phase > 0}-${selected}`;
    const needsLayout =
      cameraChanged || layoutKey !== nextLayout || measurementsDirty;
    if (!needsLayout && !labelsMoving) {
      fadeLabels();
      return false;
    }
    layoutKey = nextLayout;
    const visible = run.steps
      .filter(
        (s) =>
          s.iteration <= (phase > 0 ? incoming : iteration) &&
          s.cost !== null &&
          s.quality !== null &&
          inView(s.cost, s.quality),
      )
      .map((s) => ({
        id: String(s.iteration),
        x: x(s.cost!),
        y: y(s.quality!),
        label: name(s.iteration),
      }));
    const ids = [selected, "0", ...frontierIds];
    const targets = [...new Set(ids)]
      .map((id) => visible.find((p) => p.id === id))
      .filter((p): p is (typeof visible)[number] => !!p);
    const targetIds = new Set(targets.map((target) => Number(target.id)));
    for (const [id, label] of labels) {
      if (targetIds.has(id)) continue;
      label.group.remove();
      label.leader.remove();
      labels.delete(id);
    }
    const measures = targets.map((target) => {
      const id = Number(target.id);
      const isSelected = target.id === selected;
      let label = labels.get(id);
      if (!label) {
        const group = node("g", { "data-label-for": id });
        const rect = node("rect", { x: 0, y: 0, rx: 5 });
        const text = node("text", {
          "text-anchor": "middle",
          "dominant-baseline": "central",
        });
        text.textContent = target.label;
        group.append(rect, text);
        const leader = node("path", { "data-label-for": id });
        layer("labels").append(group);
        layer("leaders").append(leader);
        label = {
          group,
          rect,
          text,
          leader,
          width: 0,
          height: 0,
          selected: isSelected,
          anchor: { x: target.x, y: target.y },
          box: null,
          goal: null,
        };
        labels.set(id, label);
      }
      label.group.setAttribute(
        "class",
        isSelected ? "map-label selected" : "map-label",
      );
      if (measurementsDirty || !label.width || label.selected !== isSelected) {
        // Measure only new labels or actual typography changes, never each zoom frame.
        const box = label.text.getBBox();
        label.width = Math.ceil(box.width) + 20;
        label.height = Math.ceil(box.height) + 12;
        label.rect.setAttribute("width", String(label.width));
        label.rect.setAttribute("height", String(label.height));
        label.text.setAttribute("x", String(label.width / 2));
        label.text.setAttribute("y", String(label.height / 2));
      }
      label.selected = isSelected;
      return {
        id,
        x: target.x,
        y: target.y,
        width: label.width,
        height: label.height,
      };
    });
    if (needsLayout) {
      // Carry the prior placement with its point before checking for new collisions.
      // This preserves the point-to-label offset throughout camera movement.
      const previous = new Map<number, LabelBox>();
      for (const target of measures) {
        const label = labels.get(target.id)!;
        if (label.goal)
          previous.set(target.id, {
            ...label.goal,
            x: label.goal.x + target.x - label.anchor.x,
            y: label.goal.y + target.y - label.anchor.y,
          });
      }
      const placements = placeTrajectoryLabels(
        measures,
        [
          ...visible.map((p) => ({ id: Number(p.id), x: p.x, y: p.y })),
          ...(benchmark === "gaia" && amount > 0.2
            ? Array.from({ length: 9 * 7 }, (_, i) => ({
                id: 1000 + i,
                x: 558 + (i % 9) * 18,
                y: 76 + Math.floor(i / 9) * 18,
              }))
            : []),
        ],
        { x: 94, y: 79, width: 610, height: 330 },
        previous,
      );
      placements.forEach(({ id, box }) => {
        labels.get(id)!.goal = box;
      });
    }
    measurementsDirty = false;
    const now = performance.now();
    const dt = lastLabelTime ? Math.min(64, now - lastLabelTime) : 16;
    lastLabelTime = now;
    const blend =
      reducedMotion.matches || document.hidden ? 1 : 1 - Math.exp(-dt / 100);
    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, v));
    labelsMoving = false;
    for (const target of measures) {
      const label = labels.get(target.id)!;
      const goal = label.goal!;
      const transported = label.box
        ? {
            x: label.box.x + target.x - label.anchor.x,
            y: label.box.y + target.y - label.anchor.y,
          }
        : goal;
      const box = {
        ...goal,
        x: clamp(
          transported.x + (goal.x - transported.x) * blend,
          94,
          704 - goal.width,
        ),
        y: clamp(
          transported.y + (goal.y - transported.y) * blend,
          79,
          409 - goal.height,
        ),
      };
      if (Math.hypot(box.x - goal.x, box.y - goal.y) < 0.05) {
        box.x = goal.x;
        box.y = goal.y;
      } else labelsMoving = true;
      label.box = box;
      label.anchor = { x: target.x, y: target.y };
      label.group.setAttribute("transform", `translate(${box.x} ${box.y})`);
      const endX = clamp(target.x, box.x, box.x + box.width);
      const endY = clamp(target.y, box.y, box.y + box.height);
      const length = Math.hypot(endX - target.x, endY - target.y) || 1;
      const startX = target.x + ((endX - target.x) / length) * 16;
      const startY = target.y + ((endY - target.y) / length) * 16;
      label.leader.setAttribute("d", `M${startX} ${startY}L${endX} ${endY}`);
    }
    fadeLabels();
    return labelsMoving;
  };
  const invalidateLabels = () => {
    measurementsDirty = true;
    layoutKey = "";
  };
  return { configure, render, invalidateLabels };
}

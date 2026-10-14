export type ChartPoint = { id: number; x: number; y: number };
export type LabelBox = { x: number; y: number; width: number; height: number };
export type LabelTarget = ChartPoint & { width: number; height: number };
export type PlacedLabel = LabelTarget & {
  box: LabelBox;
  start: ChartPoint;
  end: ChartPoint;
};

const clamp = (value: number, low: number, high: number) =>
  Math.max(low, Math.min(high, value));
const distanceToBox = (point: ChartPoint, box: LabelBox) =>
  Math.hypot(
    point.x - clamp(point.x, box.x, box.x + box.width),
    point.y - clamp(point.y, box.y, box.y + box.height),
  );
const overlaps = (a: LabelBox, b: LabelBox) =>
  a.x < b.x + b.width + 7 &&
  a.x + a.width + 7 > b.x &&
  a.y < b.y + b.height + 7 &&
  a.y + a.height + 7 > b.y;
const distanceToSegment = (
  point: ChartPoint,
  start: ChartPoint,
  end: ChartPoint,
) => {
  const dx = end.x - start.x,
    dy = end.y - start.y;
  const t = clamp(
    ((point.x - start.x) * dx + (point.y - start.y) * dy) /
      (dx * dx + dy * dy || 1),
    0,
    1,
  );
  return Math.hypot(point.x - start.x - t * dx, point.y - start.y - t * dy);
};

// Place current/frontier labels in free space, preserving valid prior placements.
// Costs prioritize keeping every label clear of points and of the other labels.
export function placeTrajectoryLabels(
  targets: LabelTarget[],
  points: ChartPoint[],
  bounds: LabelBox,
  previous: Map<number, LabelBox>,
): PlacedLabel[] {
  const placed: PlacedLabel[] = [];
  const center = {
    x: points.reduce((sum, p) => sum + p.x, 0) / (points.length || 1),
    y: points.reduce((sum, p) => sum + p.y, 0) / (points.length || 1),
  };
  for (const target of targets) {
    const candidates: { box: LabelBox; stable: boolean }[] = [];
    const constrain = (x: number, y: number): LabelBox => ({
      x: clamp(x, bounds.x, bounds.x + bounds.width - target.width),
      y: clamp(y, bounds.y, bounds.y + bounds.height - target.height),
      width: target.width,
      height: target.height,
    });
    const old = previous.get(target.id);
    if (old) candidates.push({ box: constrain(old.x, old.y), stable: true });
    for (const radius of [34, 50, 72, 100, 138, 184, 240]) {
      for (let direction = 0; direction < 16; direction++) {
        const angle = (direction * Math.PI) / 8;
        candidates.push({
          box: constrain(
            target.x +
              Math.cos(angle) * (radius + target.width / 2) -
              target.width / 2,
            target.y +
              Math.sin(angle) * (radius + target.height / 2) -
              target.height / 2,
          ),
          stable: false,
        });
      }
    }
    let best = candidates[0],
      bestScore = Infinity;
    for (const candidate of candidates) {
      const box = candidate.box;
      const endpoint = {
        id: target.id,
        x: clamp(target.x, box.x, box.x + box.width),
        y: clamp(target.y, box.y, box.y + box.height),
      };
      const pointCollisions = points.filter(
        (point) => distanceToBox(point, box) < 19,
      ).length;
      const labelCollisions = placed.filter((label) =>
        overlaps(box, label.box),
      ).length;
      const leaderCollisions = points.filter(
        (point) =>
          point.id !== target.id &&
          distanceToSegment(point, target, endpoint) < 12,
      ).length;
      const distance = Math.hypot(target.x - endpoint.x, target.y - endpoint.y);
      const outward =
        (box.x + box.width / 2 - target.x) * (target.x - center.x) +
        (box.y + box.height / 2 - target.y) * (target.y - center.y);
      const score =
        labelCollisions * 1e9 +
        pointCollisions * 1e8 +
        leaderCollisions * 180 +
        distance -
        (candidate.stable ? 14 : 0) -
        Math.max(-5, Math.min(5, outward / 1000));
      if (score < bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    const box = best.box;
    const end = {
      id: target.id,
      x: clamp(target.x, box.x, box.x + box.width),
      y: clamp(target.y, box.y, box.y + box.height),
    };
    const length = Math.hypot(end.x - target.x, end.y - target.y) || 1;
    const start = {
      id: target.id,
      x: target.x + ((end.x - target.x) / length) * 16,
      y: target.y + ((end.y - target.y) / length) * 16,
    };
    placed.push({ ...target, box, start, end });
  }
  return placed;
}

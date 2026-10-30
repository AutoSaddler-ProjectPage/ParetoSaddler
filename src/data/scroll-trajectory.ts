export const trajectoryChapters = [
  {
    id: "search",
    scene: "search",
    label: "The search / PS-Pareto",
    title: "Retain progress",
    body: "Keep credible quality–cost trade-offs available for later optimization steps.",
    note: "Screened-out proposals have no development point.",
  },
  {
    id: "archive",
    scene: "archive",
    label: "Final development frontier",
    title: "Choose a harness",
    body: "Choose higher quality or lower cost from the final development frontier.",
    note: "All evaluated candidates remain available for later optimization steps.",
  },
] as const;

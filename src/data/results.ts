// Paper Table 1: held-out test mean ± sample SD over three repeats.
// Q/C endpoints were selected on development data, not on these test results.
export const results = [
  {
    id: "default",
    name: "Default Agent",
    label: "Default Agent",
    endpoint: null,
    family: "default",
    cm: [70.86, 2.29, 1.17, 0.17],
    gaia: [56.22, 1.07, 0.78, 0.08],
    universes: [
      [58.26, 1.08, 0.82, 0.18],
      [53.57, 1.55, 0.71, 0.03],
      [57.2, 2.57, 0.82, 0.04],
    ],
  },
  {
    id: "as-quality",
    name: "AS-Quality",
    label: "AS-Quality",
    endpoint: null,
    family: "as",
    cm: [73.86, 3.54, 1.24, 0.04],
    gaia: [57.33, 0.67, 0.61, 0.03],
    universes: [
      [55.76, 4.7, 0.55, 0.02],
      [53.87, 5.67, 0.62, 0.04],
      [64.2, 1.23, 0.67, 0.05],
    ],
  },
  {
    id: "mh-pareto-c",
    name: "MH-Pareto C",
    label: "MH-Pareto",
    endpoint: "C",
    family: "mh",
    cm: [70.5, 3.92, 0.97, 0.05],
    gaia: [55.44, 1.5, 0.8, 0.01],
    universes: [
      [58.26, 3.28, 0.76, 0.01],
      [50.0, 2.68, 0.78, 0.02],
      [59.26, 3.27, 0.89, 0.02],
    ],
  },
  {
    id: "mh-pareto-q",
    name: "MH-Pareto Q",
    label: "MH-Pareto",
    endpoint: "Q",
    family: "mh",
    cm: [73.25, 5.88, 1.06, 0.06],
    gaia: [54.33, 2.03, 0.83, 0.04],
    universes: [
      [57.63, 3.28, 0.87, 0.06],
      [49.4, 1.36, 0.75, 0.01],
      [56.79, 3.27, 0.89, 0.07],
    ],
  },
  {
    id: "ps-pareto-c",
    name: "PS-Pareto C",
    label: "PS-Pareto",
    endpoint: "C",
    family: "ps",
    cm: [79.6, 2.43, 0.92, 0.08],
    gaia: [62.11, 2.46, 0.47, 0.0],
    universes: [
      [63.24, 4.8, 0.44, 0.01],
      [59.23, 1.03, 0.49, 0.02],
      [64.61, 3.77, 0.47, 0.0],
    ],
  },
  {
    id: "ps-pareto-q",
    name: "PS-Pareto Q",
    label: "PS-Pareto",
    endpoint: "Q",
    family: "ps",
    cm: [81.35, 3.11, 1.01, 0.02],
    gaia: [62.89, 2.14, 0.45, 0.02],
    universes: [
      [61.99, 2.35, 0.39, 0.01],
      [60.71, 2.36, 0.49, 0.03],
      [67.08, 1.89, 0.46, 0.02],
    ],
  },
] as const;
export type Benchmark = "cm" | "gaia";

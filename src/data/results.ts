// Paper Table 1: held-out test mean ± sample SD over three repeats.
// Q/C endpoints were selected on development data, not on these test results.
export const results = [
  {
    id: "default",
    name: "Default Agent",
    family: "default",
    cm: [70.86, 2.29, 1.17, 0.17],
    gaia: [56.22, 1.07, 0.78, 0.08],
  },
  {
    id: "as-quality",
    name: "AS-Quality",
    family: "as",
    cm: [73.86, 3.54, 1.24, 0.04],
    gaia: [57.33, 0.67, 0.61, 0.03],
  },
  {
    id: "mh-mincost",
    name: "MH-MinCost",
    family: "mh",
    cm: [70.02, 2.35, 1.16, 0.05],
    gaia: [39.78, 0.96, 0.62, 0.03],
  },
  {
    id: "mh-pareto-c",
    name: "MH-Pareto C",
    family: "mh",
    cm: [70.5, 3.92, 0.97, 0.05],
    gaia: [55.44, 1.5, 0.8, 0.01],
  },
  {
    id: "mh-pareto-q",
    name: "MH-Pareto Q",
    family: "mh",
    cm: [73.25, 5.88, 1.06, 0.06],
    gaia: [54.33, 2.03, 0.83, 0.04],
  },
  {
    id: "ps-mincost",
    name: "PS-MinCost",
    family: "ps",
    cm: [75.16, 2.44, 0.82, 0.07],
    gaia: [56.11, 1.71, 0.44, 0.01],
  },
  {
    id: "ps-pareto-c",
    name: "PS-Pareto C",
    family: "ps",
    cm: [79.6, 2.43, 0.92, 0.08],
    gaia: [62.11, 2.46, 0.47, 0.0],
  },
  {
    id: "ps-pareto-q",
    name: "PS-Pareto Q",
    family: "ps",
    cm: [81.35, 3.11, 1.01, 0.02],
    gaia: [62.89, 2.14, 0.45, 0.02],
  },
] as const;
export type Benchmark = "cm" | "gaia";

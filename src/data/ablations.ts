import { results } from "./results";

// Controlled ClawMark ablations: Figure 3 and Tables 2–3.
// The local-gate comparison reports means only; no uncertainty is inferred.
const costEndpoint = results.find((result) => result.id === "ps-pareto-c")!;
const qualityEndpoint = results.find((result) => result.id === "ps-pareto-q")!;

export const localGateAblation = [
  {
    label: "MinCost",
    promoted: 3,
    quality: 73.95,
    cost: 0.9,
    preferred: false,
  },
  {
    label: "Pareto",
    promoted: 11,
    quality: 75.16,
    cost: 0.82,
    preferred: true,
  },
] as const;

export const repeatedExecutionAblation = [
  {
    label: "Single-run",
    endpoint: "C",
    values: [76.95, 5.5, 0.95, 0.06],
    preferred: false,
  },
  {
    label: "Single-run",
    endpoint: "Q",
    values: [75.71, 2.1, 0.97, 0.05],
    preferred: false,
  },
  {
    label: "Three-run",
    endpoint: "C",
    values: costEndpoint.cm,
    preferred: true,
  },
  {
    label: "Three-run",
    endpoint: "Q",
    values: qualityEndpoint.cm,
    preferred: true,
  },
] as const;

export const screeningAblation = [
  {
    endpoint: "C",
    meanBased: [76.86, 5.41, 1.09, 0.09],
    bayesian: costEndpoint.cm,
  },
  {
    endpoint: "Q",
    meanBased: [76.53, 2.12, 1.15, 0.04],
    bayesian: qualityEndpoint.cm,
  },
] as const;

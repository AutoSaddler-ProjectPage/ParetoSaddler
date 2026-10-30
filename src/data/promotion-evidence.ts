// Paper, Table 9: rounded screening observations for ClawMark I-12 and its parent.
export const promotionEvidence = [
  {
    name: "Content operation",
    parent: [
      [17, 2.89],
      [100, 1.26],
      [100, 1.11],
    ],
    candidate: [
      [100, 1.44],
      [100, 2.08],
      [100, 1.94],
    ],
  },
  {
    name: "Research assistant 4",
    parent: [
      [100, 0.65],
      [100, 1.34],
      [100, 1.69],
    ],
    candidate: [
      [13, 0.76],
      [67, 0.76],
      [87, 0.91],
    ],
  },
  {
    name: "Research assistant 9",
    parent: [
      [100, 0.95],
      [100, 0.53],
      [100, 0.65],
    ],
    candidate: [
      [100, 1.03],
      [100, 0.63],
      [100, 0.72],
    ],
  },
];

export function bootstrapPromotion() {
  // Fixed randomness makes replay reproducible; each task/harness is independent.
  let state = 12026;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return (state + 0.5) / 4294967296;
  };
  const dirichlet = () => {
    const samples = [0, 0, 0].map(() => -Math.log(random()));
    const total = samples.reduce((sum, value) => sum + value, 0);
    return samples.map((value) => value / total);
  };
  const draws = [];
  const supported = [0];
  for (let index = 0; index < 10000; index++) {
    const weights = promotionEvidence.map(() => [dirichlet(), dirichlet()]);
    const outcomes = ["parent", "candidate"].map((harness, side) => {
      let quality = 0,
        cost = 0;
      promotionEvidence.forEach((task, taskIndex) => {
        task[harness as "parent" | "candidate"].forEach(([q, c], run) => {
          const weight =
            weights[taskIndex][side][run] / promotionEvidence.length;
          quality += q * weight;
          cost += c * weight;
        });
      });
      return { quality, cost };
    });
    const quality = outcomes[1].quality - outcomes[0].quality;
    const cost = (outcomes[1].cost / outcomes[0].cost - 1) * 100;
    // epsilon_C = infinity; epsilon_Q = 0.1 (10 percentage points).
    const passes = quality > 0 || (cost < 0 && quality >= -10);
    draws.push({ quality, cost, passes, weights });
    supported.push(supported[index] + Number(passes));
  }
  return { draws, supported };
}

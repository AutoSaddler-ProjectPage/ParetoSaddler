export const project = {
  title:
    "ParetoSaddler: Pareto-Guided Optimization of Agent Harnesses for Quality and Cost",
  year: 2026,
  // Replace with verified public release URLs when available.
  codeUrl: "",
  arxivUrl: "",
  authors: [
    { name: "Xingzhi Qian", affiliation: "1", note: "*" },
    { name: "Sungho Park", affiliation: "2", note: "*" },
    { name: "Rongyuan Tan", affiliation: "3", note: "*" },
    { name: "Jianbo Yu", affiliation: "4", note: "*" },
    { name: "Jue Zhang", affiliation: "5", note: "†" },
    { name: "Lorenzo Cavallaro", affiliation: "6,1", note: "" },
    { name: "Menglin Xia", affiliation: "5", note: "" },
    { name: "Yanzhi Chen", affiliation: "5", note: "" },
    { name: "Xinnuo Xu", affiliation: "5", note: "" },
    { name: "Yu Kang", affiliation: "5", note: "" },
    { name: "Xinran Zheng", affiliation: "1", note: "" },
    { name: "Gagan Somashekar", affiliation: "5", note: "" },
    { name: "Xuchao Zhang", affiliation: "5", note: "" },
    { name: "Chetan Bansal", affiliation: "5", note: "" },
    { name: "Qingwei Lin", affiliation: "5", note: "" },
    { name: "Victor Rühle", affiliation: "5", note: "" },
  ],
  affiliations: [
    "University College London",
    "Pohang University of Science and Technology",
    "Southern University of Science and Technology",
    "Southeast University",
    "Microsoft",
    "Mohamed bin Zayed University of Artificial Intelligence",
  ],
};

export const bibtex = `@misc{qian2026paretosaddler,
  title={${project.title}},
  author={${project.authors.map(({ name }) => name).join(" and ")}},
  year={${project.year}},
  note={Preprint}
}`;

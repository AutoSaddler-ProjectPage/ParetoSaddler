# ParetoSaddler Project Page

Project page for **ParetoSaddler: Pareto-Guided Optimization of Agent Harnesses for Quality and Cost**.

[Project page](https://felixqxz.github.io/paretosaddler-proj/) · [Code](https://github.com/microsoft/AutoSaddler/tree/feat/paretosaddler)

Built with Astro 6, MDX, React 19, and Tailwind CSS v4, using [Roman Hauksson-Neill's academic project page template](https://github.com/RomanHauksson/academic-project-astro-template). The presentation follows the [AutoSaddler](https://autosaddler-projectpage.github.io/) and [ActiveSaddler](https://autosaddler-projectpage.github.io/activesaddler/) project pages.

## Develop

Use Node.js 24 or later.

```bash
npm ci
npm run dev      # http://localhost:4321
npm run build    # Astro check + static build into dist/
npm run preview  # Preview the production build
```

- Page content and section layout: [`src/paper.mdx`](src/paper.mdx).
- Title, authors, resource links, and BibTeX: [`src/data/project.ts`](src/data/project.ts). Set `arxivUrl` when the paper is available on arXiv; the button is currently disabled.
- Results and ablation tables: [`src/data/results.ts`](src/data/results.ts) and [`src/data/ablations.ts`](src/data/ablations.ts). Paper figures are in [`public/figures/`](public/figures/).

## Interactive demos

- **Optimization Trajectories** — [`ScrollTrajectory.astro`](src/components/ScrollTrajectory.astro) replays 17 ClawMark or 25 GAIA2 proposals, with playback controls, diagnosis and patch descriptions, and final higher-quality or lower-cost selection. Data lives in [`src/data/trajectories.ts`](src/data/trajectories.ts).
- **Statistical Promotion Rule** — [`PromotionRule.astro`](src/components/PromotionRule.astro) illustrates Bayesian bootstrap support with animated draws and an adjustable promotion threshold. The illustration uses the rounded ClawMark I-12 observations from Table 9, stored in [`src/data/promotion-evidence.ts`](src/data/promotion-evidence.ts).

## Deploy

Pushing to `main` runs [`.github/workflows/astro.yml`](.github/workflows/astro.yml), which checks, builds, and deploys the site to [GitHub Pages](https://felixqxz.github.io/paretosaddler-proj/). In the repository settings, set **Pages → Source → GitHub Actions**.

The workflow supplies the Pages origin and base path to Astro, so assets resolve under `/paretosaddler-proj/`.

## Credits

The original template was adapted from Eliahu Horwitz's [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) and the [Nerfies project page](https://nerfies.github.io/), and is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

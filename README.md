# ParetoSaddler project page

Academic project website for **ParetoSaddler: Pareto-Guided Optimization of Agent Harnesses for Quality and Cost**. Built with Astro, MDX, and TypeScript, using the academic project template also used by the [AutoSaddler](https://autosaddler-projectpage.github.io/) and [ActiveSaddler](https://autosaddler-projectpage.github.io/activesaddler/) pages.

The page includes the paper, author affiliations, method diagram, interactive quality–cost comparisons, full overall test results, animated development trajectories, controlled ablations, and a copyable BibTeX citation. Text, figures, and numerical results are based on the supplied October 2026 preprint. Test results and development trajectories are labeled separately.

## Local development

Requires Node.js 24 or later.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro (normally `http://localhost:4321/`).

```sh
npm run build  # Astro/TypeScript check, then static production build
npm run preview
```

The build output is in `dist/`.

## Editing

| File                                      | Content                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| `src/paper.mdx`                           | Main narrative, method, experiment setup, trajectories, and ablations    |
| `src/data/project.ts`                     | Authors, affiliations, release URLs, and BibTeX                          |
| `src/data/results.ts`                     | Paper Table 1: means and sample standard deviations                      |
| `src/components/ProjectHeader.astro`      | Title, author list, resource links, and headline results                 |
| `src/components/TrajectoryExplorer.astro` | Iteration playback, timeline, dynamic Pareto archive, and patch details  |
| `src/data/trajectories.ts`                | All 17 ClawMark and 25 GAIA2 proposals from Tables 12 and 15             |
| `src/lib/trajectory-labels.ts`            | Collision-aware annotation placement and leader geometry                 |
| `src/styles/trajectory.css`               | Wide chart layout, visual hierarchy, and animation presentation          |
| `src/data/trajectory-coordinates.json`    | Approximate development coordinates recovered from Figures 7 and 8       |
| `src/components/MethodFigure.astro`       | Original vector framework diagram with zoom viewer                       |
| `src/components/ResultsExplorer.astro`    | Interactive benchmark switch, plot, selection details, and results table |
| `src/components/Citation.astro`           | Citation display and clipboard handling                                  |
| `src/styles/global.css`                   | Responsive presentation and accessible focus styling                     |
| `public/paretosaddler.pdf`                | Downloadable paper supplied for this page                                |
| `public/figures/`                         | Paper figures and social preview                                         |

The public code and arXiv URLs were not provided or independently verified. Fill in `codeUrl` and `arxivUrl` in `src/data/project.ts` when they are available. The page shows “Code — coming soon” and omits arXiv until then. The provisional BibTeX uses `note={Preprint}`; add an arXiv identifier only after publication. Update both the frontmatter title in `src/paper.mdx` and the metadata in `src/data/project.ts` if the paper title changes.

Headline cost reductions follow the paper’s reported percentages, which can differ slightly from a calculation using rounded table means. Plot markers show **held-out test means**; the quality-/cost-extreme labels refer to selection on the **development Pareto set**, so their test ordering need not match. All development-evaluated candidates remain available for refinement, including those outside the current archive.

## GitHub Pages

The included `.github/workflows/astro.yml` checks, builds, and deploys pushes to `main`. In GitHub **Settings → Pages**, set **Source → GitHub Actions**. The workflow supplies the site origin and repository base path automatically, so the paper, figures, fonts, scripts, and social metadata work under a repository subpath.

To verify a subpath build locally:

```sh
npm run build -- --site https://felixqxz.github.io --base /paretosaddler-proj
npm run preview
```

Then open `http://localhost:4321/paretosaddler-proj/` (or the port printed by Astro). Creating the local page does not publish it; pushing to the configured branch triggers deployment.

## Credits

Adapted from [Roman Hauksson-Neill’s academic project page template](https://research-template.roman.technology), originally based on the [Nerfies](https://nerfies.github.io/) project page, under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Original reusable components remain available; `documentation.md` describes the template components.

## Appendix trajectory animation and vector assets

Section 2 plays every proposal from the ClawMark and GAIA2 PS-Pareto runs. Use Play/Pause, speed, Prev/Next, the slider, numbered steps, or keyboard arrows. The explorer starts paused at the initial harness. Only Play or the iteration controls advance the run; scrolling into view does not start playback. Playback pauses when the section leaves view or the tab becomes hidden and respects reduced-motion preferences. The orange dashed frontier is recomputed from the development-evaluated candidates at the displayed iteration. Final-status labels come from the appendix tables and are distinct from this evolving frontier.

Rejected proposals have no development point and display no invented quality/cost. Continued-refinement arrows reproduce Figures 7–8; other evaluated candidates remain visible without inferred parent edges. Patch text summarizes the optimizer’s diagnoses, not independently established causal effects.

**Data precision:** the supplied PDF does not contain raw per-iteration logs. Coordinates are recovered from its vector marker geometry and axis calibration and displayed with `≈`. GAIA2 quality is aligned to its 65 × 3 binary development rollouts. The final recovered archives match the paper: ClawMark I-11/I-15/I-16, GAIA2 I-18/I-22/I-23. Replace the coordinate JSON with raw logged means if available.

The method diagram is extracted from the original PDF as SVG, preserving vector glyph outlines and paths (and the paper’s small embedded bitmap icons). It is not a raster image wrapped in SVG. The enlargement dialog supports 100–400% zoom and scrolling; the SVG also opens directly. To regenerate the vector asset and chart coordinates with Poppler installed:

```sh
python3 scripts/extract-paper-figures.py
```

Typography follows the reference pages: Noto Sans, 18px body with approximately 32px leading, 30px section headings, 24px subheadings, and 16px figure captions.

Optimization appears before Results. Its wide chart places iteration notes below the visualization. Current, frontier, and inspected points receive labels in free space with thin leader lines; placements avoid visible markers and other labels and retain valid prior positions to reduce jitter. During a transition, the newest evolution edge draws in, a small highlight follows its path, and the updated frontier fades in. Motion is disabled under reduced-motion preferences.

Future points and evolution edges are explicitly hidden using SVG visibility, independent of opacity styling. Initial load, Reset, and benchmark switches show only the initial harness; rewinding removes later points and edges.

# ParetoSaddler project page

Academic project website for **ParetoSaddler: Pareto-Guided Optimization of Agent Harnesses for Quality and Cost**. Built with Astro, MDX, and TypeScript, using the academic project template also used by the [AutoSaddler](https://autosaddler-projectpage.github.io/) and [ActiveSaddler](https://autosaddler-projectpage.github.io/activesaddler/) pages.

The page includes the paper, author affiliations, method diagram, the original vector development comparison, simultaneous benchmark test tables, animated development trajectories, controlled ablations, and a copyable BibTeX citation. Text, figures, and numerical results are based on the supplied October 2026 preprint. Test results and development trajectories are labeled separately.

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
| `src/components/MethodFigure.astro`       | Original vector framework diagram                                        |
| `src/components/ResultsExplorer.astro`    | Vector Figure 1 and grouped overall / GAIA2-universe test table           |
| `src/components/AblationStudies.astro`    | Sequential controlled-ablation sections with complete endpoint tables   |
| `src/data/ablations.ts`                   | Local-gate, repeated-execution, and screening comparisons                |
| `src/styles/publication-tables.css`       | Shared paper-style figures and accessible responsive tables              |
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

The Optimization figure automatically plays every proposal from the ClawMark and GAIA2 PS-Pareto runs once the chart enters view. The controls follow ActiveSaddler’s compact circular transport: Restart, Previous, Play/Pause and Next, with 1×/2×/4× speed selection. The full-width iteration timeline sits above the plot. Arrow keys step through iterations and Space toggles playback when the figure is focused. Playback pauses offscreen and in hidden tabs. Reduced-motion preferences disable automatic playback; the controls remain available. The original detailed iteration player is retained in source but commented out in the page. The orange dashed frontier is recomputed from the development-evaluated candidates at the displayed iteration. Final-status labels come from the appendix tables and are distinct from this evolving frontier.

Rejected proposals have no development point and display no invented quality/cost. Continued-refinement arrows reproduce Figures 7–8; other evaluated candidates remain visible without inferred parent edges. Diagnosis and patch text reproduce the complete per-iteration entries in Tables 12 and 15, with PDF line wrapping normalized. Diagnoses remain optimizer interpretations, not independently established causal effects.

**Data precision:** the supplied PDF does not contain raw per-iteration logs. Coordinates are recovered from its vector marker geometry and axis calibration and displayed with `≈`. GAIA2 quality is aligned to its 65 × 3 binary development rollouts. The final recovered archives match the paper: ClawMark I-11/I-15/I-16, GAIA2 I-18/I-22/I-23. Replace the coordinate JSON with raw logged means if available.

The method diagram is extracted from the original PDF as SVG, preserving vector glyph outlines and paths (and the paper’s small embedded bitmap icons). It is not a raster image wrapped in SVG. The original SVG is shown inline without enlargement controls. To regenerate the vector asset and chart coordinates with Poppler installed:

```sh
python3 scripts/extract-paper-figures.py
```

Typography follows the reference pages: Noto Sans, 18px body with approximately 32px leading, 30px section headings, 24px subheadings, and 16px figure captions.

Optimization appears before Results. Its wide chart places iteration notes below the visualization. Current, frontier, and inspected points receive labels in free space with thin leader lines; placements avoid visible markers and other labels and retain valid prior positions to reduce jitter. During a transition, the newest evolution edge draws in, a small highlight follows its path, and the updated frontier fades in. Motion is disabled under reduced-motion preferences.

Future points and evolution edges are explicitly hidden using SVG visibility, independent of opacity styling. Initial load, Reset, and benchmark switches show only the initial harness; rewinding removes later points and edges.

## Automatic optimization trajectories

The Optimization figure occupies one viewport in normal page flow. Its timeline advances automatically at 1.8 seconds per proposal at 1× speed after a brief initial pause, then stops at the final frontier. Scrolling never changes the selected iteration. Selecting a candidate or a camera action pauses playback for inspection; Replay and benchmark changes restart from the initial harness. ClawMark and GAIA2 remain selectable, and visible candidate markers can be selected directly on the plot. Future points and edges stay hidden until reached. Rejected proposals have no invented development measurements, and recovered coordinates remain marked approximate.

The plot is centered across the shared page width, with the desktop narrative alongside the section heading. After playback completes, Higher quality and Lower cost select the corresponding extremes of the final development frontier, using the existing recovered coordinates. Selection updates the highlighted marker and inspection record; GAIA2 also focuses the relevant detail region. Intermediate frontier candidates remain directly selectable on the plot. Replay, seeking and benchmark changes clear the deployment preference.

The iteration timeline and transport share a centered measure capped at 640px. The inspection record directly displays the complete Diagnosis and Patch entries side by side on desktop, without a separate viewer or clipped text. On mobile they stack vertically and the section grows naturally so all text remains readable. Desktop retains the single-viewport layout, and playback controls and timing are unchanged.

Evidence text uses 16px on desktop and 15px on narrow screens, with 14px headings. Diagnosis has a warm gray rule; Patch has a green rule and pale green background. Compact surrounding spacing and an aspect-ratio-based mobile plot retain room for the full text without shrinking its type.

A requestAnimationFrame clock drives a fractional iteration playhead. Refinement strokes draw continuously and a separate arrowhead follows the actual path tangent. Candidate markers and the before/after empirical frontiers cross-fade as each step completes. Fractional frames reuse label geometry. The iteration slider pauses playback and supports revisiting individual iterations, including with keyboard arrows.

Refinement arrows reproduce the reported continued-refinement chain, with endpoints trimmed clear of markers. Very short connections use arcs without moving data points. The current incoming edge is highlighted; a separate gold dashed line denotes the Pareto frontier. Labels preserve valid prior positions and avoid evaluated points. A compact legend and inspection record distinguish the current candidate and its reported parent.

The title and authors, abstract, Method, Results, Analysis and citation use the original page layout. The original detailed iteration player and patch notes remain commented out for optional restoration. The method figure remains the original SVG. Source: `src/components/ScrollTrajectory.astro`, `src/data/scroll-trajectory.ts`, `src/lib/scroll-trajectory-plot.ts`, `src/styles/scroll-trajectory.css`.

GAIA2 uses an automatic detail view for later refinements (I-12 onward): the camera smoothly narrows to $0.345–$0.415 and 54–63% development quality. A linked full-run overview marks the visible region, and its button or “Show full trajectory” returns to the original axes at the same iteration. Full view highlights the cluster with a clickable “Zoom this area” target; selecting a reached candidate in that region also zooms into it while retaining the selection. The header provides the same “Zoom into cluster” action. The view buttons describe the next action rather than naming modes. The selected refinement keeps its arrowhead; historical edges remain faint context. The focus view preserves the recovered coordinates and the overview includes all reached evaluated candidates. ClawMark retains its original view. Source: `src/lib/trajectory-context.ts` and the scroll-trajectory modules above.

## Shared figure presentation

All page content uses one centered 64rem measure with a shared 1.5rem minimum gutter: the hero, headline metrics, section headings, abstract, analysis, figures, tables, trajectory, and BibTeX block. The measure is defined once in `src/styles/global.css`; tables retain their own horizontal scrolling on small screens. Citation uses the same Expressive Code BibTeX presentation as the reference sites, including syntax highlighting and a compact copy control.

Content headings follow both reference sites' Noto Sans typography: section headings at 30px/40px with weight 700, and subheadings at 24px/36px with weight 600, using normal letter spacing. These sizes also apply on narrow screens; component panel headings use 14px/20px with weight 600. Shared size tokens are defined in `src/styles/global.css`.

`src/styles/figure-ui.css` provides the common typography, tab selection, focus treatment, muted text and promotion playback appearance for the trajectory and promotion-rule figures. `src/lib/figure-typography.ts` compensates for SVG scaling, with bounded enlargement on small screens; trajectory labels are remeasured after typography changes. Section anchors and page structure are retained. The trajectory clock, speed selection, scientific data and screening calculation are unchanged.

## Results and ablations

Results shows the original vector Figure 1 followed by one grouped table: ClawMark and GAIA2 overall results plus GAIA2 universes U21, U22 and U27. Both benchmark results are visible without tabs. The six previously displayed methods are retained; MinCost rows remain excluded from the main comparison. Q/C superscripts identify development-selected endpoints. Bold and underlined means indicate the best and second-best values among the displayed methods.

The main table emphasizes the overall benchmark columns, uses fixed numeric tracks for decimal alignment, and gives standard deviations and universe-level results a quieter typographic treatment. Quality/cost rows are paired closely with more space between methods; subtle rules and pale green ParetoSaddler rows retain the paper-style comparison. These presentation rules are scoped to the main table.

The three controlled ablations are stacked as RQ1–RQ3, using the paper's research questions. Each includes a quantitative finding and analysis grounded in the reported execution evidence. RQ1 keeps the results table embedded in its figure; RQ2 and RQ3 also include standalone tables. The local-gate comparison reports held-out means and promoted-candidate counts from Figure 3. Repeated execution and Bayesian screening include both C/Q endpoints and all mean/SD values from Tables 2–3. Preferred three-run and Bayesian values reuse the main-results data. No SD is invented for the local-gate comparison. The analysis distinguishes the two optimization runs used for the promotion examples, notes the additional execution cost of the three-run protocol, and separates retrospective screening replay from the end-to-end screening ablation.

RQ1–RQ3 also include the original vector Figures 3, 5, and 6: local-gate trajectories, run-to-run variability, and retrospective promotion-threshold sensitivity. RQ1 uses the figure’s embedded results table instead of a duplicate standalone table, with analysis flowing alongside the figure. RQ2 and RQ3 pair wider tables with compact figures capped at 360px so their labels stay close to body-text size. Analysis flows below the shorter table and around the figure, using the full width after clearing it; this avoids an empty half-column. Narrow screens use one compact column followed by analysis; RQ2 and RQ3 retain their 360px figure cap. Table type sizes are retained, with tighter cell padding and wrapping column headers. Original axes, legends, annotations, and the Figure 3 results inset are retained. To regenerate the cropped SVGs from the bundled PDF:

```sh
python3 scripts/extract-ablation-figures.py
```

Sections use natural content height. Wide figures and tables scroll inside their own accessible regions on narrow screens, preserving legible type without page overflow. To regenerate Figure 1 from the bundled PDF using Poppler:

```sh
python3 scripts/extract-results-figure.py
```

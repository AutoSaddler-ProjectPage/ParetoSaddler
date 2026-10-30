import coordinates from "./trajectory-coordinates.json";

export type TrajectoryBenchmark = "cm" | "gaia";
export type TrajectoryStep = {
  iteration: number;
  title: string;
  diagnosis: string;
  change: string;
  finalStatus: "Initial" | "Dominated" | "Pareto" | "Rejected";
  quality: number | null;
  cost: number | null;
  continuedFrom: number | null;
};

type Patch = [title: string, diagnosis: string, change: string];
// Full diagnosed issues and implemented changes from Appendix I, Table 12,
// and Appendix J, Table 15. Only PDF line wrapping is normalized.
// Diagnoses are optimizer interpretations, not isolated causal attributions.
const clawmarkPatches: Patch[] = [
  [
    "Preserve private evidence and reduce tool overhead",
    "Private allergy notes and same-name ambiguity were overlooked; schema probing, unavailable Python commands, and large image batches consumed budget.",
    "Added internal-evidence and Python compatibility guidance, Notion raw-API fallback steps, and smaller-batch advice in the image-tool description.",
  ],
  [
    "Complete live updates and budget arithmetic",
    "Live trackers were not updated; budgets omitted actual spending; release conclusions omitted observed log gaps; schema and package probing continued after sufficient evidence.",
    "Added guidance for live updates, complete budget arithmetic, release-evidence preservation, and fallbacks without extra dependencies.",
  ],
  [
    "Contact responsible parties; bound schema probes",
    "Required mentor contact was omitted; repeated Notion schema probes continued despite known identifiers and usable raw APIs.",
    "Added responsible-party contact guidance and instructions to use known identifiers or raw APIs after one schema probe.",
  ],
  [
    "Write required artifacts before optional checks",
    "Optional presentation and media exploration delayed required artifacts; a higher compensation tier was conflated with a compliance hold.",
    "Added artifact-first guidance and instructions to report provisional tier eligibility separately while preserving compliance holds.",
  ],
  [
    "Bound fallbacks; keep disputed appeals open",
    "Missing memory tools and helpers were repeatedly probed; a disputed appeal was prematurely marked resolved.",
    "Added bounded-fallback and unresolved-appeal guidance.",
  ],
  [
    "Record every discrepancy and send requested messages",
    "Contradictions and independent expense flags were omitted; requested financial messages were only drafted; missing helpers triggered retries.",
    "Added row-level discrepancy and communication guidance, and bounded helper retries.",
  ],
  [
    "Use local evidence and avoid full-schema dumps",
    "Unavailable web tools, full-schema reads, helper probes, and delegation of bounded local work added overhead despite high training scores.",
    "Disabled unavailable web tools in configuration; revised Notion and tool-access skills to avoid full-schema reads; added local-first and bounded-fallback guidance.",
  ],
  [
    "Stop unnecessary exploration and transcription polling",
    "Optional web exploration continued despite sufficient local evidence; one rollout exhausted its length budget without delivery; scheduling, risk calibration, and transcription polling were inefficient.",
    "Added local-evidence, date, and risk-calibration guidance; revised Whisper skill instructions to start with a small model and limit polling.",
  ],
  [
    "Check schedules and hard eligibility thresholds",
    "Time-zone and commute constraints were not jointly checked; optional meeting setup delayed output; invitations violated an explicit eligibility threshold.",
    "Added scheduling and hard-threshold guidance, artifact-before-setup instructions, and local handling of bounded work.",
  ],
  [
    "Keep media evidence in output rows",
    "Visual facts and unassigned actions were lost; transcription and process-control loops displaced deliverables; live spreadsheet writes were difficult to verify.",
    "Added media-evidence and live-readback guidance, a Sheets REST fallback in tool-use instructions, and targeted transcription with bounded polling.",
  ],
  [
    "Write audit rows before backend exploration",
    "Explicit attendance evidence remained pending; backend exploration delayed required audit and reconciliation tables.",
    "Added local-audit-first guidance, followed by live writes and readback, and policy-timestamp-based status decisions.",
  ],
  [
    "Deliver local artifacts before yielding",
    "Bounded record review was delegated, and execution yielded before required local artifacts were written.",
    "Reworked subagent-orchestration guidance to prioritize local artifacts, delegate only separable work, and yield only when necessary.",
  ],
  [
    "Preserve explicit actions and consistent counts",
    "HR outlier counts and current recruiting stages were inconsistent; an explicitly required action remained only in notes.",
    "Added outlier-counting, live/local consistency, and independent action-row guidance for explicit instructions.",
  ],
  [
    "Stop after sufficient evidence; report exceptions",
    "Optional backend and public queries continued after sufficient evidence; date discrepancies and budget overruns were not reported as exceptions.",
    "Added evidence-sufficiency stopping guidance and explicit cross-document date, status, and budget discrepancy reporting.",
  ],
  [
    "Finish files, updates, and messages before waiting",
    "Budget flags were omitted; waiting for subagents blocked email delivery; generic summaries replaced schema-specific findings.",
    "Added budget-exception and schema-specific evidence guidance; required feasible artifacts, live writes, and communications before yielding.",
  ],
  [
    "Keep independent issues in independent rows",
    "An aspirin timeline and a stakeholder’s departure were not preserved as independent evidence; a low-value taxi claim without a receipt was rejected despite an approval exception.",
    "Added schema-aligned evidence-row guidance and instructions to request approval for eligible missing-receipt claims rather than silently reject them.",
  ],
  [
    "Separate recommendations from purchase authority",
    "Recommendations were confused with purchase authorization; primary blockers were omitted; unavailable helpers and invalid Notion URLs disrupted execution.",
    "Added recommendation-versus-authorization and blocker-preservation guidance, with immediate fallback after invalid Notion URLs.",
  ],
];
const gaiaPatches: Patch[] = [
  [
    "Complete clear tasks before asking for clarification",
    "Blocked rescheduling delayed safe deletions; announcements omitted details; contact lookup required paging.",
    "Added partial-completion and message guidance, pagination reminders, and city/country contact search.",
  ],
  [
    "Make messages self-contained and normalize search",
    "Cancellation messages were vague; punctuation-sensitive product search caused retries.",
    "Added self-contained message guidance and normalized fallback search after empty product results.",
  ],
  [
    "Deliver complete replies through the final-answer tool",
    "Email replies omitted detail and signatures; bare final text caused invalid-answer retries.",
    "Added reply-completeness guidance and a final-answer tool-use guard.",
  ],
  [
    "Anchor relative dates and validate recipients",
    "Relative dates were misinterpreted; contact IDs were used as phone recipients; separate emails were batched.",
    "Added temporal guidance, Calendar/Email contracts, and phone-recipient validation.",
  ],
  [
    "Search contacts by role and clean up multiple files",
    "Literal prefix matching missed required files; missing role search prompted broad contact scans.",
    "Added role-aware contact search and multi-file cleanup guidance.",
  ],
  [
    "Guard writes that depend on ambiguous names",
    "Name ambiguity failed to block dependent writes; final answers incurred retries.",
    "Added ambiguity-aware write guards, focused blocker messages, and tool-based final delivery.",
  ],
  [
    "Clarify exact events before proposing alternatives",
    "Unresolved event references prompted speculative alternatives and broad historical searches.",
    "Added exact-event clarification guidance and narrow date/time search preferences.",
  ],
  [
    "Distinguish a booked ride from a delayed ride",
    "A BOOKED cab’s nonzero delay estimate triggered unnecessary contingency actions.",
    "Clarified BOOKED versus DELAYED cab semantics.",
  ],
  [
    "Read email headers and batch contact lookup",
    "Successful aggregation retained full email bodies and used serial contact lookups.",
    "Added compact date-filtered email reads, batched contact lookup, and lightweight membership checks.",
  ],
  [
    "Scope calendar searches and preserve product variants",
    "Broad calendar evidence distorted attendee ranking; shopping output obscured variants.",
    "Added scoped calendar search, variant-aware product output, and finalization guards.",
  ],
  [
    "Batch crime-rate lookup and guard event cardinality",
    "Daily replacements were created per cancellation; location checks were serial; internal markers polluted context.",
    "Added cardinality guards, batched crime lookup, apartment filters, and internal-marker removal.",
  ],
  [
    "Filter ride history and clarify email contracts",
    "Cab locations and meeting references remained ambiguous; email roles and tool arguments were misinterpreted.",
    "Added ambiguity guards, date-filtered ride history, role search, and revised email/checkout contracts.",
  ],
  [
    "Continue ride follow-ups; notify before waiting",
    "Execution stopped before cab contingencies or waited before updates; questions and product searches were mis-scoped.",
    "Added continuation, update-before-wait, and concise-question guidance, plus age-aware product search.",
  ],
  [
    "Return compact contact activity summaries",
    "Timeouts were treated as availability; activity counting required extensive paging.",
    "Added availability-dependent booking guards and compact contact activity summaries.",
  ],
  [
    "Clarify names and saved addresses",
    "Ambiguous names and stale addresses led to unsafe actions; filtered contacts required paging.",
    "Added recipient/address guards and status/profession contact search.",
  ],
  [
    "Check ride timing and pending replies",
    "Cab timing and pending replies were misinterpreted; email sign-offs were unstable.",
    "Added timing, reply-completeness, lunch-conflict, and email-sign-off guidance.",
  ],
  [
    "Read email recency and stop unnecessary idle waits",
    "Completed shopping re-entered idle waits; email queries lacked recency and oldest-first access.",
    "Added termination guidance, recency summaries, and oldest-first email listing.",
  ],
  [
    "Search whole words and ask for missing duration",
    "Substring matches caused extra email replies; calendar clarification omitted missing duration.",
    "Added scoped whole-word email search and complete conflict-clarification guidance.",
  ],
  [
    "Preserve product details in purchase messages",
    "Purchase messages omitted products; gift emails were unstable; known contacts triggered repeated lookups.",
    "Added product-specific announcement, gift-notice, and compact messaging-availability guidance.",
  ],
  [
    "Complete cancellation follow-ups and email details",
    "Cancellation workflows omitted follow-up; attendance emails lacked detail; broad calendar reads increased cost.",
    "Added follow-up and email-completeness guards and discouraged broad calendar reads.",
  ],
  [
    "Align scheduled-call replies with semantic checks",
    "Scheduled-call replies completed writes but failed semantic checks due to underspecified wording.",
    "Added a targeted scheduled-call reply guard and aligned tool guidance.",
  ],
  [
    "Preserve descriptors and fall back from Messages to Chats",
    "Fallback emails omitted unanswered-message context; product descriptors were lost; fuzzy searches were redundant.",
    "Added fallback framing, descriptor-preservation guidance, and direct Messages-to-Chats fallback.",
  ],
  [
    "Clarify saved addresses and filter discount codes",
    "Phone recipients were treated as unavailable; apartment ambiguity was unresolved; discount inspection was serial.",
    "Added apartment-booking guards, direct phone-number messaging, and filtered discount lookup.",
  ],
  [
    "Search contact fields jointly before destructive actions",
    "Combined name/city search obscured name ambiguity before destructive or dependent writes.",
    "Added multi-field contact search and a destructive-action ambiguity guard.",
  ],
  [
    "Continue unrelated work around ride ambiguity",
    "Location ambiguity blocked unrelated work; cab arguments mismatched expected behavior; discount discovery was repeated.",
    "Added cab ambiguity and immediate-ride guidance, delayed-cab continuation, and threshold discount filtering.",
  ],
];

function build(
  benchmark: TrajectoryBenchmark,
  patches: Patch[],
  rejected: number[],
  archive: number[],
  chain: number[],
): TrajectoryStep[] {
  const positions: Record<string, { quality: number; cost: number }> =
    coordinates[benchmark];
  const baseline: TrajectoryStep = {
    iteration: 0,
    title: "Initial harness",
    diagnosis: "The starting point before ParetoSaddler optimization.",
    change:
      "Prompts, tools, middleware, and control logic have not yet been updated by this run.",
    finalStatus: "Initial",
    ...positions["0"],
    continuedFrom: null,
  };
  return [
    baseline,
    ...patches.map(([title, diagnosis, change], i): TrajectoryStep => {
      const iteration = i + 1;
      const index = chain.indexOf(iteration);
      return {
        iteration,
        title,
        diagnosis,
        change,
        finalStatus: rejected.includes(iteration)
          ? "Rejected"
          : archive.includes(iteration)
            ? "Pareto"
            : "Dominated",
        quality: positions[String(iteration)]?.quality ?? null,
        cost: positions[String(iteration)]?.cost ?? null,
        continuedFrom: index >= 0 ? (index === 0 ? 0 : chain[index - 1]) : null,
      };
    }),
  ];
}

export const trajectories = {
  cm: {
    name: "ClawMark",
    figure: 7,
    table: 12,
    page: 22,
    tasks: 20,
    proposals: 17,
    archive: [11, 15, 16],
    xDomain: [0.75, 1.52],
    yDomain: [64, 79],
    xTicks: [0.8, 1.0, 1.2, 1.4],
    yTicks: [65, 68, 71, 74, 77],
    steps: build(
      "cm",
      clawmarkPatches,
      [2, 5, 12, 13, 14],
      [11, 15, 16],
      [1, 3, 4, 6, 7, 10, 11, 15, 16],
    ),
  },
  gaia: {
    name: "GAIA2",
    figure: 8,
    table: 15,
    page: 23,
    tasks: 65,
    proposals: 25,
    archive: [18, 22, 23],
    xDomain: [0.18, 0.91],
    yDomain: [49.5, 65.8],
    xTicks: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    yTicks: [50, 53, 56, 59, 62, 65],
    steps: build(
      "gaia",
      gaiaPatches,
      [3, 5, 6, 7, 20],
      [18, 22, 23],
      [1, 4, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 22, 23],
    ),
  },
};

export function frontierAt(
  steps: TrajectoryStep[],
  iteration: number,
): TrajectoryStep[] {
  const evaluated = steps.filter(
    (s) => s.iteration <= iteration && s.quality !== null && s.cost !== null,
  );
  return evaluated
    .filter(
      (s) =>
        !evaluated.some(
          (other) =>
            other.quality! >= s.quality! &&
            other.cost! <= s.cost! &&
            (other.quality! > s.quality! || other.cost! < s.cost!),
        ),
    )
    .sort((a, b) => a.cost! - b.cost!);
}

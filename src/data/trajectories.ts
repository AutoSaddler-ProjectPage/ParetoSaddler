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
// Diagnoses and implemented changes: Appendix I, Table 12; Appendix J, Table 15.
// These summarize optimizer interpretations, not isolated causal attributions.
const clawmarkPatches: Patch[] = [
  [
    "Preserve private evidence and reduce tool overhead",
    "Private allergy notes and same-name ambiguity were overlooked; schema probes, unavailable Python commands, and large image batches consumed budget.",
    "Add internal-evidence and Python compatibility guidance, Notion REST fallbacks, and smaller image batches.",
  ],
  [
    "Complete live updates and budget arithmetic",
    "Trackers were not updated, actual spending and release log gaps were omitted, and tool probing continued after sufficient evidence.",
    "Require live updates, complete budget arithmetic, preserved release evidence, and fallbacks without extra dependencies.",
  ],
  [
    "Contact responsible parties; bound schema probes",
    "Required mentor contact was omitted, while repeated Notion probes continued despite known identifiers and usable APIs.",
    "Add responsible-party contact guidance and switch to known identifiers or raw APIs after one schema probe.",
  ],
  [
    "Write required artifacts before optional checks",
    "Presentation and media exploration delayed artifacts; higher compensation tiers were conflated with compliance holds.",
    "Prioritize artifact delivery and report provisional tier eligibility separately from compliance holds.",
  ],
  [
    "Bound fallbacks; keep disputed appeals open",
    "Missing memory tools and helpers were repeatedly probed; a disputed appeal was prematurely marked resolved.",
    "Add bounded-fallback guidance and preserve unresolved appeal status.",
  ],
  [
    "Record every discrepancy and send requested messages",
    "Contradictions and independent expense flags were omitted, financial messages were only drafted, and missing helpers triggered retries.",
    "Preserve row-level discrepancies, complete requested communications, and bound helper retries.",
  ],
  [
    "Use local evidence and avoid full-schema dumps",
    "Unavailable web tools, full-schema reads, helper probes, and delegation added overhead despite high training scores.",
    "Disable unavailable web tools; avoid full-schema reads; keep bounded work local and use bounded fallbacks.",
  ],
  [
    "Stop unnecessary exploration and transcription polling",
    "Optional web exploration continued despite local evidence; a rollout exhausted its budget without delivery.",
    "Use local evidence, calibrate dates and risk, start transcription with a small model, and limit polling.",
  ],
  [
    "Check schedules and hard eligibility thresholds",
    "Time zones and commutes were not jointly checked; meeting setup delayed output and invitations violated an explicit threshold.",
    "Add scheduling and hard-threshold guidance; write artifacts before optional setup and keep bounded work local.",
  ],
  [
    "Keep media evidence in output rows",
    "Visual facts and unassigned actions were lost; transcription loops displaced deliverables and spreadsheet writes were hard to verify.",
    "Preserve media facts, require live readbacks, add Google Sheets REST fallbacks, and bound transcription polling.",
  ],
  [
    "Write audit rows before backend exploration",
    "Explicit attendance evidence remained pending while backend exploration delayed required audit and reconciliation tables.",
    "Write local audit artifacts first, then perform live writes and readbacks; decide status using policy timestamps.",
  ],
  [
    "Deliver local artifacts before yielding",
    "Bounded record review was delegated and execution yielded before required local artifacts were written.",
    "Prioritize local artifacts, delegate only separable work, and yield only when necessary.",
  ],
  [
    "Preserve explicit actions and consistent counts",
    "HR outlier counts and recruiting stages were inconsistent; a required action appeared only in notes.",
    "Add outlier-counting, live/local consistency, and independent action-row guidance.",
  ],
  [
    "Stop after sufficient evidence; report exceptions",
    "Optional queries continued after sufficient evidence; date discrepancies and budget overruns were not reported.",
    "Add evidence-sufficiency stopping rules and explicit date, status, and budget exception reporting.",
  ],
  [
    "Finish files, updates, and messages before waiting",
    "Budget flags were omitted; waiting for subagents blocked email delivery and generic summaries replaced specific findings.",
    "Preserve budget exceptions and schema-specific findings; complete feasible artifacts, writes, and communications before yielding.",
  ],
  [
    "Keep independent issues in independent rows",
    "An aspirin timeline and stakeholder departure were merged; an eligible small missing-receipt claim was rejected despite an approval exception.",
    "Write schema-aligned, independent evidence rows and request approval for eligible missing-receipt claims.",
  ],
  [
    "Separate recommendations from purchase authority",
    "Recommendations were confused with authorization, blockers were omitted, and invalid Notion URLs disrupted execution.",
    "Preserve authorization boundaries and primary blockers; fall back immediately after invalid Notion URLs.",
  ],
];
const gaiaPatches: Patch[] = [
  [
    "Complete clear tasks before asking for clarification",
    "Blocked rescheduling delayed safe deletions, announcements omitted details, and contact lookup required paging.",
    "Add partial-completion guidance, complete messages, pagination reminders, and city/country contact search.",
  ],
  [
    "Make messages self-contained and normalize search",
    "Cancellation messages were vague; punctuation-sensitive product search caused retries.",
    "Preserve context in messages and normalize fallback product queries after empty results.",
  ],
  [
    "Deliver complete replies through the final-answer tool",
    "Replies omitted details and signatures; bare final text caused invalid-answer retries.",
    "Add reply-completeness guidance and a final-answer tool-use guard.",
  ],
  [
    "Anchor relative dates and validate recipients",
    "Relative dates were misinterpreted, internal contact IDs became phone recipients, and separate emails were batched.",
    "Add task-time guidance, Calendar/Email contracts, and phone-recipient validation.",
  ],
  [
    "Search contacts by role and clean up multiple files",
    "Literal prefix matching missed required files; missing role search prompted broad contact scans.",
    "Add role-aware contact search and multi-file cleanup guidance.",
  ],
  [
    "Guard writes that depend on ambiguous names",
    "Name ambiguity did not block dependent writes and final answers incurred retries.",
    "Add ambiguity-aware write guards, focused blocker messages, and tool-based final delivery.",
  ],
  [
    "Clarify exact events before proposing alternatives",
    "Unresolved event references prompted speculative alternatives and broad historical searches.",
    "Ask for exact event clarification and prefer narrow date/time searches.",
  ],
  [
    "Distinguish a booked ride from a delayed ride",
    "A BOOKED cab’s nonzero delay estimate triggered unnecessary contingency actions.",
    "Clarify BOOKED versus DELAYED cab semantics.",
  ],
  [
    "Read email headers and batch contact lookup",
    "Successful aggregation retained full email bodies and performed serial contact lookups.",
    "Add compact date-filtered email reads, batched contact lookup, and lightweight membership checks.",
  ],
  [
    "Scope calendar searches and preserve product variants",
    "Broad calendar evidence distorted attendee ranking and shopping output obscured variants.",
    "Add scoped calendar queries, variant-aware output, and finalization guards.",
  ],
  [
    "Batch crime-rate lookup and guard event cardinality",
    "Daily replacements were created per cancellation, location checks were serial, and internal markers polluted context.",
    "Add cardinality guards, batched crime lookup, apartment filters, and internal-marker removal.",
  ],
  [
    "Filter ride history and clarify email contracts",
    "Cab locations and meetings remained ambiguous; email roles and tool arguments were misinterpreted.",
    "Add ambiguity guards, date-filtered ride history, role search, and revised email/checkout contracts.",
  ],
  [
    "Continue ride follow-ups; notify before waiting",
    "Execution stopped before cab contingencies or waited before updates; questions and product searches were mis-scoped.",
    "Continue pending work, send updates before waiting, ask concise questions, and use age-aware product search.",
  ],
  [
    "Return compact contact activity summaries",
    "Timeouts were treated as availability and counting contact activity required extensive paging.",
    "Guard booking by availability and add compact contact activity summaries.",
  ],
  [
    "Clarify names and saved addresses",
    "Ambiguous names and stale addresses led to unsafe actions; filtered contacts required paging.",
    "Add recipient/address guards and status/profession contact search.",
  ],
  [
    "Check ride timing and pending replies",
    "Cab timing and pending replies were misinterpreted; email sign-offs were unstable.",
    "Add timing, reply-completeness, lunch-conflict, and email-sign-off guidance.",
  ],
  [
    "Read email recency and stop unnecessary idle waits",
    "Completed shopping re-entered idle waits; email queries lacked recency and oldest-first access.",
    "Add termination guidance, recency summaries, and oldest-first email listing.",
  ],
  [
    "Search whole words and ask for missing duration",
    "Substring matches caused extra email replies and calendar clarification omitted missing duration.",
    "Add scoped whole-word email search and complete conflict clarification.",
  ],
  [
    "Preserve product details in purchase messages",
    "Purchase messages omitted products, gift emails were unstable, and known contacts triggered repeated lookups.",
    "Add product-specific announcements, gift notices, and compact messaging-availability guidance.",
  ],
  [
    "Complete cancellation follow-ups and email details",
    "Cancellation follow-ups and attendance email details were omitted; broad calendar reads increased cost.",
    "Add follow-up and email-completeness guards and discourage broad calendar reads.",
  ],
  [
    "Align scheduled-call replies with semantic checks",
    "Scheduled-call replies completed writes but failed semantic checks because of underspecified wording.",
    "Add a targeted scheduled-call reply guard and align tool guidance.",
  ],
  [
    "Preserve descriptors and fall back from Messages to Chats",
    "Fallback emails omitted unanswered-message context, product descriptors were lost, and fuzzy searches repeated.",
    "Preserve fallback context and product descriptors; switch directly from Messages to Chats when needed.",
  ],
  [
    "Clarify saved addresses and filter discount codes",
    "Phone recipients appeared unavailable, apartment ambiguity was unresolved, and discount inspection was serial.",
    "Add apartment-booking guards, direct phone-number messaging, and discount-rate filtering.",
  ],
  [
    "Search contact fields jointly before destructive actions",
    "Combined name/city search obscured ambiguity before destructive or dependent writes.",
    "Add multi-field contact search and a destructive-action ambiguity guard.",
  ],
  [
    "Continue unrelated work around ride ambiguity",
    "Location ambiguity blocked unrelated work, cab arguments mismatched behavior, and discount discovery repeated.",
    "Add cab ambiguity and immediate-ride guidance, delayed-cab continuation, and threshold discount filtering.",
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

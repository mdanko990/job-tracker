// Positive pipeline stages in order. REJECTED / WITHDRAWN / GHOSTED are
// outcomes, not stages, so they don't advance an application.
const PIPELINE = [
  "SAVED",
  "APPLIED",
  "SCREENING",
  "TECHNICAL_INTERVIEW",
  "FINAL_ROUND",
  "OFFER",
] as const;

type PipelineStage = (typeof PIPELINE)[number];

// Rows shown in the funnel: "how many reached at least this stage".
const FUNNEL_STAGES = [
  "SAVED",
  "APPLIED",
  "SCREENING", // 1st interview
  "TECHNICAL_INTERVIEW", // 2nd interview
  "OFFER",
] as const satisfies readonly PipelineStage[];

function stageRank(status: string) {
  return PIPELINE.indexOf(status as PipelineStage);
}

/**
 * For each funnel stage, counts applications whose furthest positive stage
 * (across their whole status history) is at or beyond it.
 */
export function computeStageFunnel(
  applications: { currentStatus: string; statusEvents: { status: string }[] }[],
) {
  const furthest = applications.map((app) =>
    Math.max(
      0, // every application starts as SAVED
      stageRank(app.currentStatus),
      ...app.statusEvents.map((e) => stageRank(e.status)),
    ),
  );

  return FUNNEL_STAGES.map((stage) => ({
    stage,
    count: furthest.filter((rank) => rank >= stageRank(stage)).length,
  }));
}

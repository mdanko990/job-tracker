"use client";

import { getStatusChipClass } from "@/lib/status-colors";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

const STAGE_LABELS: Record<string, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  SCREENING: "1st interview",
  TECHNICAL_INTERVIEW: "2nd interview",
  OFFER: "Offer",
};

/**
 * How far applications got: each row counts applications that reached at
 * least that stage, even if they were later rejected, withdrawn or ghosted.
 */
export default function StageFunnel() {
  const { data, isLoading } = trpc.analytics.stageFunnel.useQuery();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <ul className="flex flex-col gap-3 text-sm">
      {(data ?? []).map(({ stage, count }) => (
        <li key={stage} className="flex items-center gap-2">
          <span
            className={cn(
              "h-2.5 w-2.5 shrink-0 rounded-full",
              getStatusChipClass(stage),
            )}
          />
          <span className="text-muted-foreground">
            {STAGE_LABELS[stage] ?? stage}
          </span>
          <span className="ml-auto font-semibold tabular-nums">{count}</span>
        </li>
      ))}
    </ul>
  );
}

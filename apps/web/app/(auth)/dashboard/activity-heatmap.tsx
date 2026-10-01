"use client";

import {
  CalendarHeatmap,
  CalendarHeatmapBlock,
  CalendarHeatmapBody,
  CalendarHeatmapFooter,
  CalendarHeatmapLegend,
  CalendarHeatmapStat,
} from "@/components/heatmap/calendar-heatmap";
import { trpc } from "@/lib/trpc";

/** Status changes and logged actions per day over the last year. */
export default function ActivityHeatmap() {
  const { data, isLoading } = trpc.analytics.heatmapCalendar.useQuery({
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <CalendarHeatmap
      data={data ?? []}
      weekStart={1}
      singleRow
      labels={{
        stat: "{{value}} updates in the last year",
        cellLabel: "{{date}}: {{value}} updates",
        legendLevelLabel: "{{level}} updates",
      }}
      colors={{ scale: "var(--primary)" }}
    >
      <CalendarHeatmapBody hideYearLabels>
        {({ activity, dayIndex, weekIndex }) => (
          <CalendarHeatmapBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </CalendarHeatmapBody>
      <CalendarHeatmapFooter>
        <CalendarHeatmapStat />
        <CalendarHeatmapLegend />
      </CalendarHeatmapFooter>
    </CalendarHeatmap>
  );
}

// components/applications-pie.tsx
"use client";
import { useState } from "react";
import { Pie, PieChart, Cell, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";

const STATUS_LABELS: Record<string, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  SCREENING: "Screened",
  TECHNICAL_INTERVIEW: "Interviewed",
  FINAL_ROUND: "Final round",
  OFFER: "Offered",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  GHOSTED: "Ghosted",
};

// Same CSS variables backing STATUS_CHIP_CLASS's Tailwind classes (bg-status-saved etc.),
// referenced directly since recharts needs raw color values, not class names.
const STATUS_COLOR_VAR: Record<string, string> = {
  SAVED: "var(--color-status-saved)",
  APPLIED: "var(--color-status-applied)",
  SCREENING: "var(--color-status-screening)",
  TECHNICAL_INTERVIEW: "var(--color-status-technical-interview)",
  FINAL_ROUND: "var(--color-status-final-round)",
  OFFER: "var(--color-status-offer)",
  REJECTED: "var(--color-status-terminal)",
  WITHDRAWN: "var(--color-status-terminal)",
  GHOSTED: "var(--color-status-terminal)",
};

const RANGES = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "overall", label: "Overall" },
] as const;

export default function ApplicationsPie() {
  const [range, setRange] = useState<(typeof RANGES)[number]["value"]>("week");
  const { data, isLoading } = trpc.analytics.statusBreakdown.useQuery({
    range,
  });

  const chartData = (data ?? []).map((d) => ({
    status: d.status,
    label: STATUS_LABELS[d.status] ?? d.status,
    value: d.count,
    fill: STATUS_COLOR_VAR[d.status] ?? "var(--muted-foreground)",
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const chartConfig = Object.fromEntries(
    chartData.map((d) => [d.status, { label: d.label, color: d.fill }]),
  ) satisfies ChartConfig;

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-end mb-4">
        <Select
          value={range}
          onValueChange={(v) => setRange(v as typeof range)}
        >
          <SelectTrigger className="w-32 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      ) : total === 0 ? (
        <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
          No applications in this period.
        </div>
      ) : (
        <div className="grid grid-cols-5">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[250px] col-span-3"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                innerRadius={70}
                outerRadius={100}
                strokeWidth={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox)) return null;
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 8}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 16}
                          className="fill-muted-foreground text-xs"
                        >
                          Total Analyzed
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="col-span-2 flex flex-col gap-2 ml-4 pl-4 border-l text-sm">
            {chartData.map((d) => (
              <div key={d.status} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: d.fill }}
                />
                <span>
                  <span className="font-semibold">
                    {Math.round((d.value / total) * 100)}%
                  </span>{" "}
                  <span className="text-muted-foreground">{d.label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

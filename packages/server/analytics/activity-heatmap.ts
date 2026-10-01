export type DailyActivity = {
  date: string; // YYYY-MM-DD in the user's time zone
  value: number;
};

/** Falls back to UTC for unknown or missing IANA time zone names. */
export function resolveTimeZone(timeZone: string | undefined) {
  if (!timeZone) return "UTC";

  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return timeZone;
  } catch {
    return "UTC";
  }
}

function dateKeyFormatter(timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (date: Date) => {
    const parts = Object.fromEntries(
      formatter.formatToParts(date).map((p) => [p.type, p.value]),
    );
    return `${parts.year}-${parts.month}-${parts.day}`;
  };
}

/**
 * Counts events per calendar day in `timeZone`.
 *
 * The window's first and last days are always included (with 0 if empty),
 * because the heatmap only fills gaps *between* the dates it receives.
 */
export function groupActivityByDay(
  timestamps: Date[],
  timeZone: string,
  from: Date,
  to: Date,
): DailyActivity[] {
  const toDateKey = dateKeyFormatter(timeZone);
  const counts = new Map<string, number>([
    [toDateKey(from), 0],
    [toDateKey(to), 0],
  ]);

  for (const timestamp of timestamps) {
    const key = toDateKey(timestamp);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts]
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

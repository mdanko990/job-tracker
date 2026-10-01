// Mirrors the web app (apps/web/app/globals.css and applications-pie.tsx).

export const STATUS_LABELS: Record<string, string> = {
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

const TERMINAL_COLOR = "#94A3B8";

export const STATUS_COLORS: Record<string, string> = {
  SAVED: "#A5509F",
  APPLIED: "#D66EAB",
  SCREENING: "#72C9BF",
  TECHNICAL_INTERVIEW: "#AED688",
  FINAL_ROUND: "#F69173",
  OFFER: "#FCB247",
  REJECTED: TERMINAL_COLOR,
  WITHDRAWN: TERMINAL_COLOR,
  GHOSTED: TERMINAL_COLOR,
};

export function getStatusColor(status: string) {
  return STATUS_COLORS[status] ?? TERMINAL_COLOR;
}

export const RANGES = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "overall", label: "Overall" },
] as const;

export type Range = (typeof RANGES)[number]["value"];

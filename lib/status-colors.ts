export const STATUS_BUTTON_CLASS: Record<string, string> = {
  SAVED: "bg-status-saved hover:bg-status-saved/90",
  APPLIED: "bg-status-applied hover:bg-status-applied/90",
  SCREENING: "bg-status-screening hover:bg-status-screening/90",
  TECHNICAL_INTERVIEW:
    "bg-status-technical-interview hover:bg-status-technical-interview/90",
  FINAL_ROUND: "bg-status-final-round hover:bg-status-final-round/90",
  OFFER: "bg-status-offer hover:bg-status-offer/90",
  REJECTED: "bg-status-terminal hover:bg-status-terminal/90",
  WITHDRAWN: "bg-status-terminal hover:bg-status-terminal/90",
  GHOSTED: "bg-status-terminal hover:bg-status-terminal/90",
};

export const STATUS_CHIP_CLASS: Record<string, string> = {
  SAVED: "bg-status-saved",
  APPLIED: "bg-status-applied",
  SCREENING: "bg-status-screening",
  TECHNICAL_INTERVIEW: "bg-status-technical-interview",
  FINAL_ROUND: "bg-status-final-round",
  OFFER: "bg-status-offer",
  REJECTED: "bg-status-terminal",
  WITHDRAWN: "bg-status-terminal",
  GHOSTED: "bg-status-terminal",
};

export function getStatusChipClass(status: string) {
  return STATUS_CHIP_CLASS[status] ?? "bg-status-terminal";
}

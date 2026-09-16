import { getStatusChipClass } from "@/lib/status-colors";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium text-white ${getStatusChipClass(status)}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

import { getActionChipClass, getActionTextClass } from "@/lib/action-colors";

interface ActionBadgeProps {
  actionType: string;
}

export function ActionBadge({ actionType }: ActionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${getActionChipClass(actionType)} ${getActionTextClass(actionType)}`}
    >
      {actionType.replaceAll("_", " ")}
    </span>
  );
}

"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpc } from "@/lib/trpc";

const TERMINAL_STATUSES = ["REJECTED", "WITHDRAWN", "GHOSTED"] as const;

const SCENARIOS: Record<string, { next?: string; actions: string[] }> = {
  SAVED: {
    next: "APPLIED",
    actions: [
      "EMAIL_SENT",
      "EMAIL_RECEIVED",
      "PEER_CONNECTION",
      "HR_CONNECTION",
      "PEER_MESSAGE",
      "HR_MESSAGE",
      "OTHER",
    ],
  },
  APPLIED: {
    next: "SCREENING",
    actions: [
      "PEER_CONNECTION",
      "HR_CONNECTION",
      "PEER_MESSAGE",
      "HR_MESSAGE",
      "CONFIRMATION_RECEIVED",
      "INVITATION_RECEIVED",
      "INVITATION_ACCEPTED",
      "EMAIL_SENT",
      "EMAIL_RECEIVED",
      "OTHER",
    ],
  },
  SCREENING: {
    next: "TECHNICAL_INTERVIEW",
    actions: [
      "PEER_CONNECTION",
      "HR_CONNECTION",
      "PEER_MESSAGE",
      "HR_MESSAGE",
      "EMAIL_SENT",
      "EMAIL_RECEIVED",
      "INVITATION_RECEIVED",
      "INVITATION_ACCEPTED",
      "PHONE_CALL",
      "VIDEO_CALL",
      "FOLLOW_UP_SENT",
      "OFFER_RECEIVED",
      "OTHER",
    ],
  },
  TECHNICAL_INTERVIEW: {
    next: "FINAL_ROUND",
    actions: [
      "PEER_CONNECTION",
      "HR_CONNECTION",
      "PEER_MESSAGE",
      "HR_MESSAGE",
      "CONFIRMATION_RECEIVED",
      "EMAIL_SENT",
      "EMAIL_RECEIVED",
      "INVITATION_RECEIVED",
      "INVITATION_ACCEPTED",
      "PHONE_CALL",
      "VIDEO_CALL",
      "TAKE_HOME_SUBMITTED",
      "FOLLOW_UP_SENT",
      "OFFER_RECEIVED",
      "OTHER",
    ],
  },
  FINAL_ROUND: {
    next: "OFFER",
    actions: [
      "PEER_CONNECTION",
      "HR_CONNECTION",
      "PEER_MESSAGE",
      "EMAIL_SENT",
      "EMAIL_RECEIVED",
      "INVITATION_RECEIVED",
      "INVITATION_ACCEPTED",
      "PHONE_CALL",
      "VIDEO_CALL",
      "FOLLOW_UP_SENT",
      "OFFER_RECEIVED",
      "OTHER",
    ],
  },
  OFFER: {
    actions: [
      "PEER_CONNECTION",
      "HR_CONNECTION",
      "PEER_MESSAGE",
      "EMAIL_SENT",
      "EMAIL_RECEIVED",
      "PHONE_CALL",
      "VIDEO_CALL",
      "OTHER",
    ],
  },
};

interface StatusStepperProps {
  applicationId: string;
  currentStatus: string;
}

export function StatusStepper({
  applicationId,
  currentStatus,
}: StatusStepperProps) {
  const [open, setOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState("");
  const [actionType, setActionType] = useState("");
  const [comment, setComment] = useState("");
  const utils = trpc.useUtils();

  const scenario = SCENARIOS[currentStatus];

  const targetOptions = useMemo(() => {
    const options = [...TERMINAL_STATUSES] as string[];
    if (scenario?.next) options.unshift(scenario.next);
    return options;
  }, [scenario]);

  const updateStatus = trpc.application.updateStatus.useMutation({
    meta: { successMessage: "Status updated" },
    onSuccess: () => {
      utils.application.list.invalidate();
      utils.application.byId.invalidate({ id: applicationId });
      reset();
    },
  });

  const reset = () => {
    setOpen(false);
    setTargetStatus("");
    setActionType("");
    setComment("");
  };

  const submit = () => {
    if (!targetStatus) return;
    updateStatus.mutate({
      id: applicationId,
      status: targetStatus as any,
      actionType: (actionType || undefined) as any,
      comment: comment || undefined,
    });
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => (next ? setOpen(true) : reset())}
    >
      <PopoverTrigger asChild>
        <Button type="button" size="sm">
          {currentStatus.replaceAll("_", " ")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 flex flex-col gap-2">
        <Select value={targetStatus} onValueChange={setTargetStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Move to..." />
          </SelectTrigger>
          <SelectContent>
            {targetOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={actionType} onValueChange={setActionType}>
          <SelectTrigger>
            <SelectValue placeholder="Action type (optional)" />
          </SelectTrigger>
          <SelectContent>
            {scenario?.actions.map((action) => (
              <SelectItem key={action} value={action}>
                {action.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          placeholder="Comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button
          type="button"
          size="sm"
          disabled={!targetStatus}
          onClick={submit}
        >
          Confirm
        </Button>
      </PopoverContent>
    </Popover>
  );
}

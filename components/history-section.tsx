"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ActionBadge } from "./action-badge";

const ACTION_TYPES = [
  "PEER_CONNECTION",
  "HR_CONNECTION",
  "PEER_MESSAGE",
  "HR_MESSAGE",
  "EMAIL_SENT",
  "EMAIL_RECEIVED",
  "CONFIRMATION_RECEIVED",
  "INVITATION_RECEIVED",
  "INVITATION_ACCEPTED",
  "PHONE_CALL",
  "VIDEO_CALL",
  "TAKE_HOME_SUBMITTED",
  "FOLLOW_UP_SENT",
  "OFFER_RECEIVED",
  "OTHER",
];

interface StatusEvent {
  id: string;
  status: string;
  actionType: string | null;
  comment: string | null;
  occurredAt: string | Date;
}

interface HistorySectionProps {
  applicationId: string;
  events: StatusEvent[];
}

export function HistorySection({ applicationId, events }: HistorySectionProps) {
  const [adding, setAdding] = useState(false);
  const [actionType, setActionType] = useState("");
  const [comment, setComment] = useState("");
  const utils = trpc.useUtils();

  const addNote = trpc.application.addHistoryNote.useMutation({
    meta: { successMessage: "Added to history" },
    onSuccess: () => {
      utils.application.byId.invalidate({ id: applicationId });
      setAdding(false);
      setActionType("");
      setComment("");
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Label>History</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAdding(true)}
        >
          <Plus /> Add entry
        </Button>
      </div>

      {adding && (
        <div className="flex flex-col gap-2 border rounded-md p-3">
          <Select value={actionType} onValueChange={setActionType}>
            <SelectTrigger>
              <SelectValue placeholder="Action type" />
            </SelectTrigger>
            <SelectContent>
              {ACTION_TYPES.map((a) => (
                <SelectItem key={a} value={a}>
                  {a.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Description"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAdding(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!actionType}
              onClick={() =>
                addNote.mutate({
                  applicationId,
                  actionType: actionType as any,
                  comment: comment || undefined,
                })
              }
            >
              Save
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex flex-col text-sm border-l-2 pl-3 py-1"
          >
            <div className="flex gap-2 items-baseline">
              <span className="font-medium">
                {event.status.replaceAll("_", " ")}
              </span>
              {event.actionType && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <ActionBadge actionType={event.actionType} />
                </>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(event.occurredAt).toLocaleString()}
              </span>
            </div>
            {event.comment && (
              <p className="text-muted-foreground">{event.comment}</p>
            )}
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">No history yet.</p>
        )}
      </div>
    </div>
  );
}

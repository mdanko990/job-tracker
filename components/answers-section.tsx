"use client";
import { useState } from "react";
import { Plus, X, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

interface AnswersSectionProps {
  applicationId: string;
}

type AnswerDraft = {
  question: string;
  answer: string;
};

const emptyDraft: AnswerDraft = {
  question: "",
  answer: "",
};

export function AnswersSection({ applicationId }: AnswersSectionProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AnswerDraft>(emptyDraft);

  const utils = trpc.useUtils();
  const { data: formAnswers = [] } = trpc.formAnswer.listByApplication.useQuery(
    { applicationId },
    { enabled: !!applicationId },
  );

  const invalidate = () =>
    utils.formAnswer.listByApplication.invalidate({ applicationId });
  const createAnswer = trpc.formAnswer.create.useMutation({
    meta: { successMessage: "Answer added" },
    onSuccess: invalidate,
  });
  const updateAnswer = trpc.formAnswer.update.useMutation({
    meta: { successMessage: "Answer updated" },
    onSuccess: invalidate,
  });
  const deleteAnswer = trpc.formAnswer.delete.useMutation({
    meta: { successMessage: "Answer deleted" },
    onSuccess: invalidate,
  });

  function startAdd() {
    setDraft(emptyDraft);
    setEditingId(null);
    setAdding(true);
  }

  function startEdit(formAnswer: (typeof formAnswers)[number]) {
    setDraft({
      question: formAnswer.question,
      answer: formAnswer.answer,
    });
    setEditingId(formAnswer.id);
    setAdding(true);
  }

  function cancel() {
    setAdding(false);
    setEditingId(null);
    setDraft(emptyDraft);
  }

  function save() {
    if (!draft.question.trim()) return;
    if (editingId) {
      updateAnswer.mutate({ id: editingId, ...draft });
    } else {
      createAnswer.mutate({ applicationId, ...draft });
    }
    cancel();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Label>Application Q&A</Label>
        <Button type="button" variant="outline" size="sm" onClick={startAdd}>
          <Plus />
        </Button>
      </div>

      {formAnswers.map((formAnswer) => (
        <div
          key={formAnswer.id}
          className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm"
        >
          <div className="flex-1">
            <div className="font-medium">{formAnswer.question}</div>
            <div className="font-light">{formAnswer.answer}</div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => startEdit(formAnswer)}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => deleteAnswer.mutate({ id: formAnswer.id })}
          >
            <X />
          </Button>
        </div>
      ))}

      {adding && (
        <div className="flex flex-col gap-2 border rounded-md p-3">
          <Input
            placeholder="Question"
            value={draft.question}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
          />
          <Input
            placeholder="Answer"
            value={draft.answer}
            onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={cancel}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={save}>
              <Check /> Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

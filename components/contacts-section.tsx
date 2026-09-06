"use client";
import { useState } from "react";
import { Plus, X, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

interface ContactsSectionProps {
  companyId: string;
}

type ContactDraft = {
  name: string;
  linkedin: string;
  isConnected: boolean;
  isMessaged: boolean;
};

const emptyDraft: ContactDraft = {
  name: "",
  linkedin: "",
  isConnected: false,
  isMessaged: false,
};

export function ContactsSection({ companyId }: ContactsSectionProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ContactDraft>(emptyDraft);

  const utils = trpc.useUtils();
  const { data: contacts = [] } = trpc.contact.listByCompany.useQuery(
    { companyId },
    { enabled: !!companyId },
  );

  const invalidate = () =>
    utils.contact.listByCompany.invalidate({ companyId });
  const createContact = trpc.contact.create.useMutation({
    meta: { successMessage: "Contact added" },
    onSuccess: invalidate,
  });
  const updateContact = trpc.contact.update.useMutation({
    meta: { successMessage: "Contact updated" },
    onSuccess: invalidate,
  });
  const deleteContact = trpc.contact.delete.useMutation({
    meta: { successMessage: "Contact deleted" },
    onSuccess: invalidate,
  });

  function startAdd() {
    setDraft(emptyDraft);
    setEditingId(null);
    setAdding(true);
  }

  function startEdit(contact: (typeof contacts)[number]) {
    setDraft({
      name: contact.name,
      linkedin: contact.linkedin ?? "",
      isConnected: contact.isConnected,
      isMessaged: contact.isMessaged,
    });
    setEditingId(contact.id);
    setAdding(true);
  }

  function cancel() {
    setAdding(false);
    setEditingId(null);
    setDraft(emptyDraft);
  }

  function save() {
    if (!draft.name.trim()) return;
    if (editingId) {
      updateContact.mutate({ id: editingId, ...draft });
    } else {
      createContact.mutate({ companyId, ...draft });
    }
    cancel();
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center">
        <Label>Contacts</Label>
        <Button type="button" variant="outline" size="sm" onClick={startAdd}>
          <Plus />
        </Button>
      </div>

      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm"
        >
          <div className="flex-1">
            <div className="font-medium">{contact.name}</div>
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                className="text-xs text-muted-foreground underline"
              >
                LinkedIn
              </a>
            )}
          </div>
          <span className="text-xs">
            {contact.isConnected ? "Connected" : "Not connected"}
          </span>
          <span className="text-xs">
            {contact.isMessaged ? "Messaged" : "Not messaged"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => startEdit(contact)}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => deleteContact.mutate({ id: contact.id })}
          >
            <X />
          </Button>
        </div>
      ))}

      {adding && (
        <div className="flex flex-col gap-2 border rounded-md p-3">
          <Input
            placeholder="Name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Input
            placeholder="LinkedIn URL"
            value={draft.linkedin}
            onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })}
          />
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={draft.isConnected}
                onCheckedChange={(v) =>
                  setDraft({ ...draft, isConnected: !!v })
                }
                id="isConnected"
              />
              <Label htmlFor="isConnected">Connected</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={draft.isMessaged}
                onCheckedChange={(v) => setDraft({ ...draft, isMessaged: !!v })}
                id="isMessaged"
              />
              <Label htmlFor="isMessaged">Messaged</Label>
            </div>
          </div>
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

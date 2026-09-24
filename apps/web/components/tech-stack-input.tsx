"use client";
import { useState, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TechStackInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function TechStackInput({ value, onChange }: TechStackInputProps) {
  const [draft, setDraft] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const tech = draft.trim();
      if (tech && !value.includes(tech)) onChange([...value, tech]);
      setDraft("");
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap gap-2 rounded-md border px-3 py-2">
      {value.map((tech) => (
        <Badge key={tech} variant="secondary" className="gap-1">
          {tech}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tech))}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        className="flex-1 min-w-[80px] outline-none bg-transparent text-sm"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length ? "" : "Type a tech and press Enter"}
      />
    </div>
  );
}

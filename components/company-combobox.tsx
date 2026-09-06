// components/company-combobox.tsx
"use client";
import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

interface CompanyComboboxProps {
  value: string | null;
  onChange: (companyId: string) => void;
}

export function CompanyCombobox({ value, onChange }: CompanyComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: companies = [] } = trpc.company.list.useQuery();
  const utils = trpc.useUtils();
  const createCompany = trpc.company.create.useMutation({
    meta: { successMessage: "Company created" },
    onSuccess: (newCompany) => {
      utils.company.list.invalidate();
      onChange(newCompany.id);
      setOpen(false);
      setSearch("");
    },
  });

  const selected = companies.find((c) => c.id === value);
  const exactMatch = companies.some(
    (c) => c.name.toLowerCase() === search.trim().toLowerCase(),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between font-normal"
        >
          {selected ? selected.name : "Select company..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search company..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No company found.</CommandEmpty>
            <CommandGroup>
              {companies.map((company) => (
                <CommandItem
                  key={company.id}
                  value={company.name}
                  onSelect={() => {
                    onChange(company.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === company.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {company.name}
                </CommandItem>
              ))}
              {search.trim() && !exactMatch && (
                <CommandItem
                  value={`create-${search}`}
                  onSelect={() => createCompany.mutate({ name: search.trim() })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{search.trim()}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

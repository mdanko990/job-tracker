"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { features } from "@/lib/table-features";
import { StatusBadge } from "@/components/status-badge";
import { ActionBadge } from "@/components/action-badge";

export type ApplicationRow = {
  id: string;
  companyName: string;
  jobTitle: string | null;
  currentStatus: string;
  location: string | null;
  actionType: string | null;
  lastInteractionAt: string | null;
};

function SortableHeader({ column, label }: { column: any; label: string }) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

function FilterInput({
  column,
  placeholder,
}: {
  column: any;
  placeholder: string;
}) {
  return (
    <Input
      className="h-8 mt-1 w-full"
      placeholder={placeholder}
      value={(column.getFilterValue() as string) ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
    />
  );
}

export const columns: ColumnDef<typeof features, ApplicationRow>[] = [
  {
    accessorKey: "jobTitle",
    filterFn: "includesString",
    header: ({ column }) => (
      <div className="flex flex-col mb-1">
        <SortableHeader column={column} label="Job title" />
        <FilterInput column={column} placeholder="Filter title..." />
      </div>
    ),
    cell: ({ row }) => row.original.jobTitle ?? "—",
  },
  {
    accessorKey: "companyName",
    filterFn: "includesString",
    header: ({ column }) => (
      <div className="flex flex-col mb-1">
        <SortableHeader column={column} label="Company" />
        <FilterInput column={column} placeholder="Filter company..." />
      </div>
    ),
  },
  {
    accessorKey: "location",
    filterFn: "includesString",
    header: ({ column }) => (
      <div className="flex flex-col mb-1">
        <SortableHeader column={column} label="Location" />
        <FilterInput column={column} placeholder="Filter location..." />
      </div>
    ),
    cell: ({ row }) => row.original.location ?? "—",
  },
  {
    accessorKey: "remotePolicy",
    filterFn: "includesString",
    header: ({ column }) => (
      <div className="flex flex-col mb-1">
        <SortableHeader column={column} label="Work" />
        <FilterInput column={column} placeholder="Filter type..." />
      </div>
    ),
  },
  {
    accessorKey: "currentStatus",
    filterFn: "includesString",
    header: ({ column }) => (
      <div className="flex flex-col mb-1">
        <SortableHeader column={column} label="Status" />
        <FilterInput column={column} placeholder="Filter status..." />
      </div>
    ),
    cell: ({ row }) => {
      console.log(row.original.currentStatus);
      return <StatusBadge status={row.original.currentStatus} />;
    },
  },
  {
    accessorKey: "actionType",
    filterFn: "includesString",
    header: ({ column }) => (
      <div className="flex flex-col mb-1">
        <SortableHeader column={column} label="Last action" />
        <FilterInput column={column} placeholder="Filter action..." />
      </div>
    ),
    cell: ({ row }) =>
      row.original.actionType ? (
        <ActionBadge actionType={row.original.actionType} />
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "lastInteractionAt",
    filterFn: "includesString",
    header: ({ column }) => (
      <div className="flex flex-col mb-1">
        <SortableHeader column={column} label="Last interaction" />
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.lastInteractionAt;
      return date ? new Date(date).toLocaleDateString() : "—";
    },
  },
];

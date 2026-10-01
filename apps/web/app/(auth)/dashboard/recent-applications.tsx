"use client";
import { ActionBadge } from "@/components/action-badge";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { features } from "@/lib/table-features";
import { trpc } from "@/lib/trpc";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export type ApplicationRow = {
  id: string;
  companyName: string;
  jobTitle: string | null;
  currentStatus: string;
  location: string | null;
  actionType: string | null;
  lastInteractionAt: Date | null;
};

export const columns: ColumnDef<typeof features, ApplicationRow>[] = [
  {
    accessorKey: "jobTitle",
    filterFn: "includesString",
    header: "Job title",
    cell: ({ row }) => row.original.jobTitle ?? "—",
  },
  {
    accessorKey: "companyName",
    filterFn: "includesString",
    header: "Company",
  },
  {
    accessorKey: "currentStatus",
    filterFn: "includesString",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.currentStatus} />,
  },
  {
    accessorKey: "actionType",
    filterFn: "includesString",
    header: "Action",
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
    header: "Last iteration",
    cell: ({ row }) => {
      const date = row.original.lastInteractionAt;
      return date ? new Date(date).toLocaleDateString() : "—";
    },
  },
];

export default function RecentApplications() {
  const { data, isLoading } = trpc.application.list.useQuery({ limit: 6 });
  const router = useRouter();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  const rows: ApplicationRow[] = (data ?? []).map((app) => ({
    id: app.id,
    jobTitle: app.title,
    companyName: app.company.name,
    currentStatus: app.currentStatus,
    lastInteractionAt: app.lastInteractionAt,
    location: app.location,
    actionType: app.statusEvents[0]?.actionType ?? null,
  }));

  return (
    <DataTable
      columns={columns}
      data={rows}
      onRowClick={(row) => router.push(`/applications/${row.id}/edit`)}
    />
  );
}

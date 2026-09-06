// app/(auth)/applications/page.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { DataTable } from "@/components/data-table";
import { columns, ApplicationRow } from "./columns";
import AddForm from "./add.form";
import { useRouter } from "next/navigation";

export default function ApplicationsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data, isLoading } = trpc.application.list.useQuery(
    statusFilter === "ALL" ? undefined : { status: statusFilter as any },
  );

  if (isLoading) return <div>Loading...</div>;

  const rows: ApplicationRow[] = (data ?? []).map((app) => ({
    id: app.id,
    jobTitle: app.title,
    companyName: app.company.name,
    currentStatus: app.currentStatus,
    lastInteractionAt: app.lastInteractionAt,
    location: app.location,
    actionType: app.statusEvents[0]?.actionType ?? null,
    remotePolicy: app.remotePolicy,
  }));

  return (
    <div className="flex flex-col items-center g-2">
      <div className="flex w-full justify-between py-4">
        <h3>Applications</h3>
        <AddForm />
      </div>
      <DataTable
        columns={columns}
        data={rows}
        onRowClick={(row) => router.push(`/applications/${row.id}/edit`)}
      />
    </div>
  );
}

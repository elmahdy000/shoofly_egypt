"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { AppSelect } from "@/components/ui/app-select";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { listClientRequests } from "@/lib/api/requests";

export default function ClientRequestsPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { data, loading, error } = useAsyncData(() => listClientRequests(), []);

  const rows = useMemo(() => {
    const list = data ?? [];
    if (statusFilter === "ALL") return list;
    return list.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <div className="space-y-4">
      <SectionHeader
        title="My Requests"
        subtitle="All request statuses in one place"
        actions={<Link href="/client/requests/new" className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Create</Link>}
      />

      <AppSelect
        label="Status filter"
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { label: "All", value: "ALL" },
          { label: "Pending Admin", value: "PENDING_ADMIN_REVISION" },
          { label: "Open For Bidding", value: "OPEN_FOR_BIDDING" },
          { label: "Offers Forwarded", value: "OFFERS_FORWARDED" },
          { label: "Paid Pending Delivery", value: "ORDER_PAID_PENDING_DELIVERY" },
          { label: "Closed Success", value: "CLOSED_SUCCESS" },
        ]}
      />

      {loading ? <LoadingBlock label="Loading request list" /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error && rows.length === 0 ? (
        <EmptyState title="No matching requests" description="Try another filter or create a new request." />
      ) : null}

      <div className="space-y-3">
        {rows.map((request) => (
          <Link key={request.id} href={`/client/requests/${request.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">{request.title}</h3>
              <StatusBadge status={request.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{request.address}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

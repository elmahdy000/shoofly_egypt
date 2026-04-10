"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppSelect } from "@/components/ui/app-select";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { listVendorOpenRequests } from "@/lib/api/requests";

export default function VendorRequestsPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { data, loading, error } = useAsyncData(() => listVendorOpenRequests(), []);

  const rows = useMemo(() => {
    const list = data ?? [];
    if (statusFilter === "ALL") return list;
    return list.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <div className="space-y-4">
      <SectionHeader title="Open Requests" subtitle="Requests currently eligible for bids" />
      <AppSelect
        label="Status"
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { label: "All", value: "ALL" },
          { label: "Open For Bidding", value: "OPEN_FOR_BIDDING" },
          { label: "Bids Received", value: "BIDS_RECEIVED" },
        ]}
      />

      {loading ? <LoadingBlock label="Loading open requests" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && rows.length === 0 ? (
        <EmptyState title="No open requests" description="Admin dispatch queue is currently empty." />
      ) : null}

      <div className="space-y-3">
        {rows.map((request) => (
          <Link key={request.id} href={`/vendor/requests/${request.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
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

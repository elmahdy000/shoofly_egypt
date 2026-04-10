"use client";

import { useMemo, useState } from "react";
import { AppSelect } from "@/components/ui/app-select";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { listVendorBids } from "@/lib/api/bids";
import { formatCurrency } from "@/lib/formatters";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function VendorBidsPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { data, loading, error } = useAsyncData(() => listVendorBids(), []);

  const rows = useMemo(() => {
    const list = data ?? [];
    if (statusFilter === "ALL") return list;
    return list.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <div className="space-y-4">
      <SectionHeader title="My Bids" subtitle="Track submitted bids" />
      <AppSelect
        label="Bid status"
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { label: "All", value: "ALL" },
          { label: "Pending", value: "PENDING" },
          { label: "Selected", value: "SELECTED" },
          { label: "Accepted", value: "ACCEPTED_BY_CLIENT" },
          { label: "Rejected", value: "REJECTED" },
        ]}
      />

      {loading ? <LoadingBlock label="Loading bids" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && rows.length === 0 ? (
        <EmptyState title="No bids" description="Submit bids on open requests to populate this view." />
      ) : null}

      <div className="space-y-3">
        {rows.map((bid) => (
          <div key={bid.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Request #{bid.requestId}</h3>
              <StatusBadge status={bid.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{bid.description}</p>
            <p className="mt-2 text-sm font-semibold">{formatCurrency(bid.netPrice)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { AppButton } from "@/components/ui/app-button";
import { AppSelect } from "@/components/ui/app-select";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { listAdminWithdrawals, reviewAdminWithdrawal } from "@/lib/api/transactions";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function AdminWithdrawalsPage() {
  const [filter, setFilter] = useState("ALL");
  const { data, loading, error, setData } = useAsyncData(() => listAdminWithdrawals(), []);
  const [message, setMessage] = useState<string | null>(null);

  const rows = useMemo(() => {
    const all = data ?? [];
    if (filter === "ALL") return all;
    return all.filter((row) => row.status === filter);
  }, [data, filter]);

  async function review(withdrawalId: number, action: "APPROVE" | "REJECT") {
    try {
      const result = await reviewAdminWithdrawal(withdrawalId, action);
      setData((current) => (current ?? []).map((row) => (row.id === withdrawalId ? result : row)));
      setMessage(`Withdrawal ${withdrawalId} ${action.toLowerCase()}d.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Review failed");
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Withdrawals" subtitle="Approve or reject vendor withdrawals" />
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <AppSelect
        label="Filter"
        value={filter}
        onChange={setFilter}
        options={[
          { label: "All", value: "ALL" },
          { label: "Pending", value: "PENDING" },
          { label: "Approved", value: "APPROVED" },
          { label: "Rejected", value: "REJECTED" },
        ]}
      />

      {loading ? <LoadingBlock label="Loading withdrawals" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && rows.length === 0 ? (
        <EmptyState title="No withdrawals" description="No entries match selected filter." />
      ) : null}

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Withdrawal #{row.id} - {formatCurrency(row.amount)}</p>
              <StatusBadge status={row.status} />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Vendor: {row.vendor?.fullName ?? row.vendorId} | Created: {formatDate(row.createdAt)}
            </p>
            <div className="mt-3 flex gap-2">
              <AppButton onClick={() => review(row.id, "APPROVE")}>Approve</AppButton>
              <AppButton onClick={() => review(row.id, "REJECT")} variant="danger">Reject</AppButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

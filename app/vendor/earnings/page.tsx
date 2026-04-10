"use client";

import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { listVendorTransactions } from "@/lib/api/transactions";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function VendorEarningsPage() {
  const { data, loading, error } = useAsyncData(() => listVendorTransactions(), []);

  const summary = useMemo(() => {
    const rows = data ?? [];
    const payout = rows.filter((r) => r.type === "VENDOR_PAYOUT").reduce((sum, r) => sum + Number(r.amount ?? 0), 0);
    const withdrawals = rows.filter((r) => r.type === "WITHDRAWAL").reduce((sum, r) => sum + Number(r.amount ?? 0), 0);
    return { payout, available: payout - withdrawals };
  }, [data]);

  return (
    <div className="space-y-4">
      <SectionHeader title="Earnings" subtitle="Payout and balance view" />
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Total Payout" value={formatCurrency(summary.payout)} />
        <StatCard label="Estimated Available" value={formatCurrency(summary.available)} />
      </div>

      {loading ? <LoadingBlock label="Loading vendor transactions" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No earnings yet" description="Transactions will appear after successful delivery settlements." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((tx) => (
          <div key={tx.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{tx.type}</span>
              <span>{formatCurrency(tx.amount)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{formatDate(tx.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

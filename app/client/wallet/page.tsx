"use client";

import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { listClientTransactions } from "@/lib/api/transactions";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function WalletPage() {
  const { data, loading, error } = useAsyncData(() => listClientTransactions(), []);

  const balance = useMemo(() => {
    return (data ?? []).reduce((sum, t) => {
      const amount = Number(t.amount ?? 0);
      return t.type === "ESCROW_DEPOSIT" || t.type === "REFUND" ? sum + amount : sum - amount;
    }, 0);
  }, [data]);

  return (
    <div className="space-y-4">
      <SectionHeader title="Wallet" subtitle="Balance and recent transactions" />
      <StatCard label="Estimated Balance" value={formatCurrency(balance)} />

      {loading ? <LoadingBlock label="Loading wallet transactions" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No wallet activity" description="Transactions will appear here." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((tx) => (
          <div key={tx.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-800">{tx.type}</span>
              <span>{formatCurrency(tx.amount)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{formatDate(tx.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

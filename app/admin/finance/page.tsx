"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { listAdminTransactions } from "@/lib/api/transactions";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function AdminFinancePage() {
  const { data, loading, error } = useAsyncData(() => listAdminTransactions(), []);

  return (
    <div className="space-y-4">
      <SectionHeader title="Finance" subtitle="Platform-wide transaction stream" />
      {loading ? <LoadingBlock label="Loading transactions" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No finance rows" description="Transactions will appear here." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((tx) => (
          <div key={tx.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{tx.type}</span>
              <span>{formatCurrency(tx.amount)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              User: {tx.user?.fullName ?? "Unknown"} ({tx.user?.role ?? "-"})
            </p>
            <p className="mt-1 text-xs text-slate-500">{formatDate(tx.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

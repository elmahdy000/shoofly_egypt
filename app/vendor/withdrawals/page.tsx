"use client";

import { FormEvent, useState } from "react";
import { AppButton } from "@/components/ui/app-button";
import { AppInput } from "@/components/ui/app-input";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { listVendorWithdrawals, requestVendorWithdrawal } from "@/lib/api/transactions";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function VendorWithdrawalsPage() {
  const { data, loading, error, setData } = useAsyncData(() => listVendorWithdrawals(), []);
  const [amount, setAmount] = useState("100");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const result = await requestVendorWithdrawal(Number(amount));
      setData((current) => [result, ...(current ?? [])]);
      setMessage("Withdrawal request submitted");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to request withdrawal");
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Withdrawals" subtitle="Request and track withdrawals" />
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <AppInput label="Amount" type="number" value={amount} onChange={setAmount} />
        <AppButton type="submit">Request Withdrawal</AppButton>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </form>

      {loading ? <LoadingBlock label="Loading withdrawal history" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No withdrawals" description="Submitted requests will appear here." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((entry) => (
          <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{formatCurrency(entry.amount)}</p>
              <StatusBadge status={entry.status} />
            </div>
            <p className="mt-1 text-xs text-slate-500">Requested: {formatDate(entry.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

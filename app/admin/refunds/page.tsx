"use client";

import { FormEvent, useState } from "react";
import { AppButton } from "@/components/ui/app-button";
import { AppInput } from "@/components/ui/app-input";
import { ErrorState } from "@/components/shared/error-state";
import { SectionHeader } from "@/components/ui/section-header";
import { refundAdminRequest } from "@/lib/api/transactions";

export default function AdminRefundsPage() {
  const [requestId, setRequestId] = useState("");
  const [reason, setReason] = useState("Delivery failed");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      const result = await refundAdminRequest(Number(requestId), reason);
      setMessage(`Refund issued for request ${result.request?.id ?? requestId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refund request failed");
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Refunds" subtitle="Issue refunds for failed delivery requests" />
      {error ? <ErrorState message={error} /> : null}
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <AppInput label="Request ID" value={requestId} onChange={setRequestId} type="number" />
        <AppInput label="Reason" value={reason} onChange={setReason} />
        <AppButton type="submit">Issue Refund</AppButton>
      </form>
    </div>
  );
}

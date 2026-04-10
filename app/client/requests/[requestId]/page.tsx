"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { payClientRequest } from "@/lib/api/transactions";
import { getRequestDetails } from "@/lib/api/requests";
import { useAsyncData } from "@/lib/hooks/use-async-data";

function RequestDetailsContent({ requestId }: { requestId: number }) {
  const { data, loading, error } = useAsyncData(() => getRequestDetails(requestId), [requestId]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  async function handlePay() {
    try {
      const result = await payClientRequest(requestId);
      setActionMessage(`Payment done. Wallet balance: ${result.wallet?.balance ?? "updated"}`);
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Payment failed");
    }
  }

  if (loading) return <LoadingBlock label="Loading request details" />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <ErrorState message="Request not found" />;

  return (
    <div className="space-y-4">
      <SectionHeader title={data.title} subtitle={data.address} />
      <AppCard>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Current status</p>
          <StatusBadge status={data.status} />
        </div>
        <p className="mt-3 text-sm text-slate-700">{data.description}</p>
        <p className="mt-3 text-xs text-slate-500">Selected Bid ID: {data.selectedBidId ?? "-"}</p>
      </AppCard>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href={`/client/offers/request/${requestId}`} className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white">
          View Forwarded Offers
        </Link>
        <Link href={`/client/delivery/${requestId}`} className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-800">
          Delivery Timeline
        </Link>
      </div>

      <AppButton onClick={handlePay} variant="secondary">Pay Request</AppButton>
      {actionMessage ? <p className="text-sm text-slate-600">{actionMessage}</p> : null}
    </div>
  );
}

export default function RequestDetailsPage() {
  const params = useParams<{ requestId: string }>();
  const parsed = Number(params.requestId);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return <ErrorState message="Invalid request id." />;
  }

  return <RequestDetailsContent requestId={parsed} />;
}

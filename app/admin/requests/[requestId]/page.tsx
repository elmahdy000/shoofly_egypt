"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { forwardAdminBid, listAdminRequestBids } from "@/lib/api/bids";
import { getRequestDetails } from "@/lib/api/requests";
import { formatCurrency } from "@/lib/formatters";
import { useAsyncData } from "@/lib/hooks/use-async-data";

function AdminRequestDetails({ requestId }: { requestId: number }) {
  const request = useAsyncData(() => getRequestDetails(requestId), [requestId]);
  const bids = useAsyncData(() => listAdminRequestBids(requestId), [requestId]);
  const [message, setMessage] = useState<string | null>(null);

  async function forward(bidId: number) {
    try {
      await forwardAdminBid(bidId);
      setMessage(`Bid ${bidId} forwarded to client.`);
      bids.setData((rows) =>
        (rows ?? []).map((b) => ({ ...b, status: b.id === bidId ? "SELECTED" : b.status === "SELECTED" ? "REJECTED" : b.status }))
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Forward failed");
    }
  }

  if (request.loading) return <LoadingBlock label="Loading request" />;
  if (request.error) return <ErrorState message={request.error} />;

  return (
    <div className="space-y-4">
      <SectionHeader title={request.data?.title ?? `Request #${requestId}`} subtitle={request.data?.address} />
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">Request status</p>
          <StatusBadge status={request.data?.status} />
        </div>
      </div>

      {bids.loading ? <LoadingBlock label="Loading request bids" /> : null}
      {bids.error ? <ErrorState message={bids.error} /> : null}
      {!bids.loading && !bids.error && (bids.data?.length ?? 0) === 0 ? (
        <EmptyState title="No bids yet" description="Vendors have not submitted bids for this request." />
      ) : null}

      <div className="space-y-3">
        {(bids.data ?? []).map((bid) => (
          <div key={bid.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">Bid #{bid.id}</p>
              <StatusBadge status={bid.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">{bid.description}</p>
            <p className="mt-1 text-sm font-semibold">{formatCurrency(bid.clientPrice ?? bid.netPrice)}</p>
            <div className="mt-3">
              <AppButton onClick={() => forward(bid.id)}>Forward To Client</AppButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminRequestDetailsPage() {
  const params = useParams<{ requestId: string }>();
  const parsed = Number(params.requestId);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return <ErrorState message="Invalid request id." />;
  }

  return <AdminRequestDetails requestId={parsed} />;
}

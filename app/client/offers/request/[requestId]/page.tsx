"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { acceptClientOffer, listClientForwardedOffers } from "@/lib/api/bids";
import { formatCurrency } from "@/lib/formatters";
import { useAsyncData } from "@/lib/hooks/use-async-data";

function OffersContent({ requestId }: { requestId: number }) {
  const { data, loading, error } = useAsyncData(() => listClientForwardedOffers(requestId), [requestId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function accept(bidId: number) {
    try {
      await acceptClientOffer(bidId);
      setFeedback(`Offer ${bidId} accepted successfully.`);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Accept failed");
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Forwarded Offers" subtitle={`Request #${requestId}`} />
      {loading ? <LoadingBlock label="Loading offers" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}

      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No forwarded offers" description="Admin has not forwarded offers yet." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((offer) => (
          <div key={offer.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Bid #{offer.id}</h3>
              <StatusBadge status={offer.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{offer.description}</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{formatCurrency(offer.clientPrice ?? offer.netPrice)}</p>
            <div className="mt-3">
              <AppButton onClick={() => accept(offer.id)}>Accept Offer</AppButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientOffersPage() {
  const params = useParams<{ requestId: string }>();
  const parsed = Number(params.requestId);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return <ErrorState message="Invalid request id." />;
  }

  return <OffersContent requestId={parsed} />;
}

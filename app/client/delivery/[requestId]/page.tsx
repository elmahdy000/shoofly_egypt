"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { confirmClientDelivery, listClientDeliveryTimeline } from "@/lib/api/delivery";
import { formatDate } from "@/lib/formatters";
import { useAsyncData } from "@/lib/hooks/use-async-data";

function DeliveryPageContent({ requestId }: { requestId: number }) {
  const { data, loading, error } = useAsyncData(() => listClientDeliveryTimeline(requestId), [requestId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function confirmDelivery() {
    try {
      const result = await confirmClientDelivery(requestId);
      setFeedback(`Delivery confirmed. Request status: ${result.request?.status ?? "updated"}`);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "QR confirmation failed");
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Delivery Tracking" subtitle={`Request #${requestId}`} actions={<AppButton onClick={confirmDelivery}>Confirm by QR</AppButton>} />
      {loading ? <LoadingBlock label="Loading delivery timeline" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}

      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No delivery timeline" description="Timeline appears after payment and order placement." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <StatusBadge status={item.status} />
              <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
            </div>
            {item.note ? <p className="mt-2 text-sm text-slate-600">{item.note}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeliveryPage() {
  const params = useParams<{ requestId: string }>();
  const parsed = Number(params.requestId);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return <ErrorState message="Invalid request id." />;
  }

  return <DeliveryPageContent requestId={parsed} />;
}

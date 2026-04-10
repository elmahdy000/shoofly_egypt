"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { listPendingAdminRequests } from "@/lib/api/requests";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function AdminBidsPage() {
  const { data, loading, error } = useAsyncData(() => listPendingAdminRequests(), []);

  return (
    <div className="space-y-4">
      <SectionHeader title="Bids" subtitle="Select a request to inspect and forward bids" />
      {loading ? <LoadingBlock label="Loading request index" /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No requests in queue" description="Bids are reviewed per request details page." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((request) => (
          <a key={request.id} href={`/admin/requests/${request.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{request.title}</h3>
              <StatusBadge status={request.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">Open details to review bids.</p>
          </a>
        ))}
      </div>
    </div>
  );
}

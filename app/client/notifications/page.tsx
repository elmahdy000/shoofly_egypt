"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDate } from "@/lib/formatters";
import { useNotificationsStream } from "@/lib/hooks/use-notifications-stream";

export default function ClientNotificationsPage() {
  const { data, loading, error, markRead } = useNotificationsStream("CLIENT", 4000);

  return (
    <div className="space-y-4">
      <SectionHeader title="Notifications" subtitle="Client account alerts (auto-refresh every 4s)" />
      {loading ? <LoadingBlock label="Loading notifications" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No notifications" description="You are up to date." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((item) => (
          <button
            key={item.id}
            onClick={() => markRead(item.id)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">{item.type}</p>
              <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{item.message}</p>
            <p className="mt-2 text-xs text-slate-400">{item.isRead ? "Read" : "Tap to mark as read"}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

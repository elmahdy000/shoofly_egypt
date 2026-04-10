"use client";

import Link from "next/link";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { listClientRequests } from "@/lib/api/requests";

export default function ClientHomePage() {
  const { data, loading, error } = useAsyncData(() => listClientRequests(), []);

  const stats = useMemo(() => {
    const rows = data ?? [];
    return {
      total: rows.length,
      open: rows.filter((r) => ["OPEN_FOR_BIDDING", "OFFERS_FORWARDED"].includes(r.status)).length,
      completed: rows.filter((r) => r.status === "CLOSED_SUCCESS").length,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Client Home"
        subtitle="Track your requests and offers"
        actions={<Link href="/client/requests/new" className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white">New Request</Link>}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Requests" value={stats.total} />
        <StatCard label="Active" value={stats.open} />
        <StatCard label="Completed" value={stats.completed} />
      </div>

      {loading ? <LoadingBlock label="Loading your requests" /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No requests yet" description="Create your first request to start receiving offers." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).slice(0, 5).map((request) => (
          <Link key={request.id} href={`/client/requests/${request.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-900">{request.title}</h3>
              <StatusBadge status={request.status} />
            </div>
            <p className="mt-2 text-sm text-slate-500">{request.address}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { AppButton } from "@/components/ui/app-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { dispatchAdminRequest, listPendingAdminRequests, reviewAdminRequest } from "@/lib/api/requests";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function AdminRequestsPage() {
  const { data, loading, error, setData } = useAsyncData(() => listPendingAdminRequests(), []);
  const [message, setMessage] = useState<string | null>(null);

  async function review(id: number, action: "approve" | "reject") {
    try {
      await reviewAdminRequest(id, action);
      setData((rows) => (rows ?? []).filter((item) => item.id !== id));
      setMessage(`Request ${id} ${action}d.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Review failed");
    }
  }

  async function dispatch(id: number) {
    try {
      await dispatchAdminRequest(id);
      setMessage(`Request ${id} dispatched to vendors.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Dispatch failed");
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Request Queue" subtitle="Pending admin revision" />
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      {loading ? <LoadingBlock label="Loading pending requests" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="Queue is empty" description="No requests need review now." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((request) => (
          <div key={request.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <Link href={`/admin/requests/${request.id}`} className="font-semibold hover:text-amber-700">
                {request.title}
              </Link>
              <StatusBadge status={request.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{request.address}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <AppButton onClick={() => review(request.id, "approve")}>Approve</AppButton>
              <AppButton onClick={() => review(request.id, "reject")} variant="danger">Reject</AppButton>
              <AppButton onClick={() => dispatch(request.id)} variant="secondary">Dispatch</AppButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

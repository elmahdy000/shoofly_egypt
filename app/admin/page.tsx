"use client";

import { useMemo } from "react";
import { LinkCard } from "@/components/shared/link-card";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { listPendingAdminRequests } from "@/lib/api/requests";
import { listAdminWithdrawals } from "@/lib/api/transactions";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function AdminDashboardPage() {
  const pending = useAsyncData(() => listPendingAdminRequests(), []);
  const withdrawals = useAsyncData(() => listAdminWithdrawals(), []);

  const pendingWithdrawals = useMemo(
    () => (withdrawals.data ?? []).filter((w) => w.status === "PENDING").length,
    [withdrawals.data]
  );

  return (
    <div className="space-y-5">
      <SectionHeader title="Admin Dashboard" subtitle="Core operational metrics" />

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Pending Reviews" value={(pending.data ?? []).length} />
        <StatCard label="Pending Withdrawals" value={pendingWithdrawals} />
        <StatCard label="Refund Queue" value="Manual" />
        <StatCard label="In Delivery" value="See Finance" />
        <StatCard label="Finance" value="Active" />
      </div>

      {pending.loading || withdrawals.loading ? <LoadingBlock label="Loading dashboard" /> : null}
      {pending.error ? <ErrorState message={pending.error} /> : null}
      {withdrawals.error ? <ErrorState message={withdrawals.error} /> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard href="/admin/requests" title="Requests" description="Review queue and dispatch flow." />
        <LinkCard href="/admin/bids" title="Bids" description="Inspect and forward offers." />
        <LinkCard href="/admin/refunds" title="Refunds" description="Issue refunds on failed deliveries." />
        <LinkCard href="/admin/withdrawals" title="Withdrawals" description="Approve or reject vendor withdrawals." />
        <LinkCard href="/admin/finance" title="Finance" description="Transaction visibility for operations." />
        <LinkCard href="/admin/settings" title="Settings" description="Platform configuration summary." />
      </div>
    </div>
  );
}

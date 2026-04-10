"use client";

import { useMemo } from "react";
import { LinkCard } from "@/components/shared/link-card";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { listVendorOpenRequests } from "@/lib/api/requests";
import { listVendorBids } from "@/lib/api/bids";

export default function VendorHomePage() {
  const openRequests = useAsyncData(() => listVendorOpenRequests(), []);
  const bids = useAsyncData(() => listVendorBids(), []);

  const stats = useMemo(() => {
    const bidRows = bids.data ?? [];
    return {
      openRequests: (openRequests.data ?? []).length,
      totalBids: bidRows.length,
      selectedBids: bidRows.filter((b) => b.status === "SELECTED" || b.status === "ACCEPTED_BY_CLIENT").length,
    };
  }, [openRequests.data, bids.data]);

  return (
    <div className="space-y-5">
      <SectionHeader title="Vendor Dashboard" subtitle="Bids, requests, and delivery ops" />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Open Requests" value={stats.openRequests} />
        <StatCard label="My Bids" value={stats.totalBids} />
        <StatCard label="Selected" value={stats.selectedBids} />
      </div>

      {openRequests.loading || bids.loading ? <LoadingBlock label="Loading vendor overview" /> : null}
      {openRequests.error ? <ErrorState message={openRequests.error} /> : null}
      {bids.error ? <ErrorState message={bids.error} /> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <LinkCard href="/vendor/requests" title="Open Requests" description="Review request details and submit bids." />
        <LinkCard href="/vendor/bids" title="My Bids" description="Track bid status and linked requests." />
        <LinkCard href="/vendor/earnings" title="Earnings" description="View transaction and payout history." />
        <LinkCard href="/vendor/withdrawals" title="Withdrawals" description="Request and track withdrawal approvals." />
      </div>
    </div>
  );
}

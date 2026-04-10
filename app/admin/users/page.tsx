"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/formatters";
import { listAdminUsers } from "@/lib/api/users";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function AdminUsersPage() {
  const { data, loading, error } = useAsyncData(() => listAdminUsers(), []);

  return (
    <div className="space-y-4">
      <SectionHeader title="Users" subtitle="Active users by role" />
      {loading ? <LoadingBlock label="Loading users" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && (data?.length ?? 0) === 0 ? (
        <EmptyState title="No users found" description="Seed users or create users to populate this list." />
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((user) => (
          <div key={user.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{user.fullName}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <StatusBadge status={user.role} />
            </div>
            <div className="mt-2 text-xs text-slate-600">
              <p>Phone: {user.phone}</p>
              <p>Wallet: {user.walletBalance}</p>
              <p>Status: {user.isActive ? "Active" : "Disabled"}</p>
              <p>Created: {formatDate(user.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

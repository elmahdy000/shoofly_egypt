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
import { listDeliveryTasks } from "@/lib/api/delivery-agent";

export default function DeliveryDashboard() {
  const { data, loading, error } = useAsyncData(() => listDeliveryTasks(), []);

  const stats = useMemo(
    () => ({
      available: data?.available.length ?? 0,
      myTasks: data?.myTasks.length ?? 0,
    }),
    [data],
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="لوحة التوصيل"
        subtitle="المهام المتاحة والمسندة إليك"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="مهام متاحة" value={stats.available} />
        <StatCard label="مهامي النشطة" value={stats.myTasks} />
      </div>

      {loading ? <LoadingBlock label="جاري التحميل..." /> : null}
      {error ? <ErrorState message={error} /> : null}

      {data?.myTasks && data.myTasks.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800">مهامي النشطة</h2>
          {data.myTasks.map((task) => (
            <Link
              key={task.id}
              href={`/delivery/tasks/${task.id}`}
              className="block rounded-2xl border border-amber-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{task.title}</h3>
                <StatusBadge
                  status={
                    task.deliveryTracking?.[0]?.status ?? "OUT_FOR_DELIVERY"
                  }
                />
              </div>
              <p className="mt-1 text-sm text-slate-500">{task.address}</p>
            </Link>
          ))}
        </div>
      ) : null}

      {!loading && !error && stats.available === 0 && stats.myTasks === 0 ? (
        <EmptyState
          title="لا توجد مهام"
          description="ستظهر مهام التوصيل المتاحة هنا."
        />
      ) : null}

      <Link
        href="/delivery/tasks"
        className="block rounded-2xl border border-amber-100 bg-amber-50 p-4 text-center font-semibold text-amber-700 hover:bg-amber-100"
      >
        عرض كل المهام المتاحة ←
      </Link>
    </div>
  );
}

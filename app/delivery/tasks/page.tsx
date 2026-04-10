"use client";

import Link from "next/link";
import { useState } from "react";
import { AppButton } from "@/components/ui/app-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import {
  acceptDeliveryTask,
  listDeliveryTasks,
} from "@/lib/api/delivery-agent";

export default function DeliveryTasksPage() {
  const { data, loading, error, setData } = useAsyncData(
    () => listDeliveryTasks(),
    [],
  );
  const [message, setMessage] = useState<string | null>(null);

  async function accept(requestId: number) {
    try {
      setMessage(null);
      await acceptDeliveryTask(requestId);
      setMessage(`تم قبول المهمة #${requestId} بنجاح`);
      // Refresh
      const updated = await listDeliveryTasks();
      setData(updated);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "فشل قبول المهمة");
    }
  }

  return (
    <div className="space-y-5">
      <SectionHeader title="المهام المتاحة" subtitle="اختر طلبًا لتسليمه" />
      {message ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {message}
        </p>
      ) : null}
      {loading ? <LoadingBlock label="جاري تحميل المهام..." /> : null}
      {error ? <ErrorState message={error} /> : null}

      {data?.myTasks && data.myTasks.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800">مهامي النشطة</h2>
          {data.myTasks.map((task) => (
            <Link
              key={task.id}
              href={`/delivery/tasks/${task.id}`}
              className="block rounded-2xl border border-amber-300 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{task.title}</h3>
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

      {!loading && !error && (data?.available.length ?? 0) === 0 ? (
        <EmptyState
          title="لا توجد مهام متاحة"
          description="انتظر حتى يجهز التجار الطلبات."
        />
      ) : null}

      {(data?.available ?? []).length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800">متاح للاستلام</h2>
          {(data?.available ?? []).map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{task.title}</h3>
                <StatusBadge status="READY_FOR_PICKUP" />
              </div>
              <p className="mt-1 text-sm text-slate-500">{task.address}</p>
              <p className="mt-1 text-xs text-slate-400">
                📞 {task.deliveryPhone}
              </p>
              <div className="mt-3">
                <AppButton onClick={() => accept(task.id)}>
                  اقبل المهمة
                </AppButton>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

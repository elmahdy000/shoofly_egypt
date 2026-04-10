"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import {
  completeDeliveryTask,
  failDeliveryTask,
  listDeliveryTasks,
} from "@/lib/api/delivery-agent";

function TaskDetail({ requestId }: { requestId: number }) {
  const router = useRouter();
  const { data, loading, error } = useAsyncData(
    () => listDeliveryTasks(),
    [requestId],
  );
  const [message, setMessage] = useState<string | null>(null);
  const [failReason, setFailReason] = useState("");

  const task = data?.myTasks.find((t) => t.id === requestId);

  async function handleComplete() {
    try {
      await completeDeliveryTask(requestId);
      setMessage("تم تأكيد التسليم بنجاح");
      setTimeout(() => router.push("/delivery"), 1500);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "فشل تأكيد التسليم");
    }
  }

  async function handleFail() {
    try {
      await failDeliveryTask(requestId, failReason || undefined);
      setMessage("تم تسجيل فشل التسليم");
      setTimeout(() => router.push("/delivery"), 1500);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "فشل تسجيل المشكلة");
    }
  }

  if (loading) return <LoadingBlock label="جاري تحميل تفاصيل المهمة..." />;
  if (error) return <ErrorState message={error} />;
  if (!task) return <ErrorState message="المهمة غير موجودة أو لم تُسند إليك" />;

  const lastStatus = task.deliveryTracking?.[0]?.status ?? "OUT_FOR_DELIVERY";

  return (
    <div className="space-y-4">
      <SectionHeader title={task.title} subtitle={`طلب #${task.id}`} />

      <AppCard>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">حالة التوصيل</span>
          <StatusBadge status={lastStatus} />
        </div>
        <p className="mt-3 text-sm text-slate-700">📍 {task.address}</p>
        <p className="mt-1 text-sm text-slate-700">📞 {task.deliveryPhone}</p>
      </AppCard>

      {message ? (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {message}
        </div>
      ) : null}

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-800">إجراءات التوصيل</h3>
        <AppButton onClick={handleComplete}>
          ✅ تأكيد الاستلام من العميل
        </AppButton>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-2 text-sm font-medium text-slate-600">
            سبب الفشل (اختياري)
          </p>
          <input
            value={failReason}
            onChange={(e) => setFailReason(e.target.value)}
            placeholder="مثال: العميل غير موجود..."
            className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-rose-300"
          />
          <AppButton variant="danger" onClick={handleFail}>
            ❌ تسجيل فشل التسليم
          </AppButton>
        </div>
      </div>
    </div>
  );
}

export default function DeliveryTaskDetailPage() {
  const params = useParams<{ requestId: string }>();
  const parsed = Number(params.requestId);
  if (!Number.isFinite(parsed) || parsed <= 0)
    return <ErrorState message="معرف طلب غير صحيح" />;
  return <TaskDetail requestId={parsed} />;
}

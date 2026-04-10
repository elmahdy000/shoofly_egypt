"use client";

import { useRouter } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { SectionHeader } from "@/components/ui/section-header";
import { logoutUser } from "@/lib/api/auth";

export default function DeliveryProfilePage() {
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    router.push("/login");
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="حسابي" subtitle="حساب مندوب التوصيل" />
      <AppCard>
        <p className="text-sm text-slate-600">أنت مسجل دخول كمندوب توصيل.</p>
        <p className="mt-2 text-sm text-slate-500">
          راجع المهام المتاحة وابدأ بالتوصيل.
        </p>
      </AppCard>
      <AppButton variant="danger" onClick={handleLogout}>
        تسجيل الخروج
      </AppButton>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { SectionHeader } from "@/components/ui/section-header";
import { logoutUser } from "@/lib/api/auth";

export default function ClientProfilePage() {
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    router.push("/login");
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="الملف الشخصي" subtitle="معلومات الحساب" />
      <AppCard>
        <p className="text-sm text-slate-600">تسجيل الدخول نشط بنجاح.</p>
        <p className="mt-2 text-sm text-slate-500">
          يمكنك رفع الطلبات ومتابعة العروض.
        </p>
      </AppCard>
      <AppButton variant="danger" onClick={handleLogout}>
        تسجيل الخروج
      </AppButton>
    </div>
  );
}

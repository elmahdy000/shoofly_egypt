"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { SectionHeader } from "@/components/ui/section-header";
import { logoutUser } from "@/lib/api/auth";

export default function VendorProfilePage() {
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    router.push("/login");
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="الملف الشخصي" subtitle="حساب المورد" />
      <AppCard>
        <p className="text-sm text-slate-600">تسجيل الدخول نشط.</p>
        <p className="mt-2 text-sm text-slate-500">
          ابدأ بمراجعة الطلبات وتقديم العروض.
        </p>
        <Link
          href="/vendor/requests"
          className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          الطلبات المفتوحة
        </Link>
      </AppCard>
      <AppButton variant="danger" onClick={handleLogout}>
        تسجيل الخروج
      </AppButton>
    </div>
  );
}

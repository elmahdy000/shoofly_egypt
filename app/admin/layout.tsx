import { AppHeader } from "@/components/layout/app-header";
import { AdminNav } from "@/components/navigation/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <AdminNav />
      <div className="min-w-0 flex-1">
        <AppHeader title="لوحة الإدارة" subtitle="وحدة التحكم الإدارية" />
        <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
      </div>
    </div>
  );
}

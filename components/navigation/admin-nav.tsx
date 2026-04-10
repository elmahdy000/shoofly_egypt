import { Sidebar } from "@/components/layout/sidebar";

const items = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/requests", label: "الطلبات" },
  { href: "/admin/bids", label: "العروض" },
  { href: "/admin/refunds", label: "المستردات" },
  { href: "/admin/withdrawals", label: "السحوبات" },
  { href: "/admin/finance", label: "المالية" },
  { href: "/admin/users", label: "المستخدمون" },
  { href: "/admin/settings", label: "الإعدادات" },
];

export function AdminNav() {
  return <Sidebar title="الإدارة" items={items} />;
}

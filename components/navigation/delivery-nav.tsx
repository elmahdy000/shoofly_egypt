"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/delivery", label: "الرئيسية", icon: "🏠" },
  { href: "/delivery/tasks", label: "المهام", icon: "📦" },
  { href: "/delivery/profile", label: "حسابي", icon: "👤" },
];

export function DeliveryNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 right-0 left-0 z-30 border-t border-amber-100 bg-white shadow-lg">
      <div className="mx-auto flex max-w-lg justify-around">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/delivery" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold transition ${active ? "text-amber-600" : "text-slate-500 hover:text-amber-500"}`}
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

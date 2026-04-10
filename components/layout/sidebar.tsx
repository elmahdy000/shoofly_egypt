import Link from "next/link";

export type SidebarItem = { href: string; label: string };

export function Sidebar({ title, items }: { title: string; items: SidebarItem[] }) {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-s border-amber-900/20 bg-stone-950 text-stone-100 lg:block">
      <div className="px-5 py-6 border-b border-stone-800">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">شوفلاي</p>
        <h2 className="mt-1 text-xl font-bold text-white">{title}</h2>
      </div>
      <nav className="px-3 pt-4 pb-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="mb-1 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-300 transition hover:bg-amber-600/20 hover:text-amber-300"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

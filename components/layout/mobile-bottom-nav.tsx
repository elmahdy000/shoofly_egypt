import Link from "next/link";

export type MobileNavItem = { href: string; label: string };

export function MobileBottomNav({ items }: { items: MobileNavItem[] }) {
  return (
    <nav className="fixed bottom-0 start-0 end-0 z-30 border-t border-amber-100 bg-white/97 px-2 py-2 backdrop-blur shadow-lg md:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-5 gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-xl px-2 py-2 text-center text-xs font-semibold text-stone-600 transition hover:bg-amber-50 hover:text-amber-700"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

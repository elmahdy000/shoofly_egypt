import Link from "next/link";

export function AppHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-amber-100 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600">شوفلاي</p>
          <h1 className="text-lg font-bold text-stone-900">{title}</h1>
          {subtitle ? <p className="text-xs text-stone-500">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <Link
            href="/"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
          >
            تغيير الدور
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(email, password);
      // Redirect based on role
      if (user.role === "CLIENT") router.push("/client");
      else if (user.role === "VENDOR") router.push("/vendor");
      else if (user.role === "ADMIN") router.push("/admin");
      else if (user.role === "DELIVERY") router.push("/delivery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-amber-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
            شوفلاي
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            تسجيل الدخول
          </h1>
          <p className="mt-1 text-sm text-stone-500">أدخل بياناتك للمتابعة</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm"
        >
          {error ? (
            <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-sm font-semibold text-stone-700">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-stone-700">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700 disabled:bg-stone-300"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-stone-500">
          ليس لديك حساب؟{" "}
          <Link
            href="/register"
            className="font-semibold text-amber-600 hover:underline"
          >
            إنشاء حساب
          </Link>
        </p>
        <p className="mt-2 text-center">
          <Link href="/" className="text-xs text-stone-400 hover:underline">
            العودة للرئيسية
          </Link>
        </p>
      </div>
    </main>
  );
}

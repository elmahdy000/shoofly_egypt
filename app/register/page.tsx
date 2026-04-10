"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"CLIENT" | "VENDOR" | "ADMIN" | "DELIVERY">(
    "CLIENT",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerUser({
        fullName,
        email,
        password,
        phone: phone || undefined,
        role,
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-amber-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
            شوفلاي
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">إنشاء حساب</h1>
          <p className="mt-1 text-sm text-stone-500">انضم إلى شوفلاي الآن</p>
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
              الاسم الكامل
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="محمد أحمد"
            />
          </div>

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

          <div>
            <label className="mb-1 block text-sm font-semibold text-stone-700">
              رقم الهاتف (اختياري)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="01xxxxxxxxx"
              dir="ltr"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-stone-700">
              نوع الحساب
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-400"
            >
              <option value="CLIENT">عميل</option>
              <option value="VENDOR">تاجر / مورد</option>
              <option value="DELIVERY">مندوب توصيل</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700 disabled:bg-stone-300"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-stone-500">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="font-semibold text-amber-600 hover:underline"
          >
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </main>
  );
}

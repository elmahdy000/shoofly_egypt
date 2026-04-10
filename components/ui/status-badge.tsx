const toneMap: Record<string, string> = {
  PENDING_ADMIN_REVISION: "bg-amber-100 text-amber-800",
  OPEN_FOR_BIDDING: "bg-blue-100 text-blue-800",
  BIDS_RECEIVED: "bg-indigo-100 text-indigo-800",
  OFFERS_FORWARDED: "bg-violet-100 text-violet-800",
  ORDER_PAID_PENDING_DELIVERY: "bg-sky-100 text-sky-800",
  CLOSED_SUCCESS: "bg-emerald-100 text-emerald-800",
  CLOSED_CANCELLED: "bg-rose-100 text-rose-800",
  REJECTED: "bg-rose-100 text-rose-800",
  PENDING: "bg-amber-100 text-amber-800",
  SELECTED: "bg-green-100 text-green-800",
  ACCEPTED_BY_CLIENT: "bg-emerald-100 text-emerald-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  WITHDRAWN: "bg-stone-100 text-stone-600",
};

const labelMap: Record<string, string> = {
  PENDING_ADMIN_REVISION: "قيد المراجعة",
  OPEN_FOR_BIDDING: "مفتوح للعروض",
  BIDS_RECEIVED: "عروض واردة",
  OFFERS_FORWARDED: "عروض مُرسلة",
  ORDER_PAID_PENDING_DELIVERY: "مدفوع - بانتظار التوصيل",
  CLOSED_SUCCESS: "مكتمل",
  CLOSED_CANCELLED: "ملغى",
  REJECTED: "مرفوض",
  PENDING: "قيد الانتظار",
  SELECTED: "مختار",
  ACCEPTED_BY_CLIENT: "مقبول من العميل",
  APPROVED: "موافق عليه",
  WITHDRAWN: "مسحوب",
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const key = status ?? "UNKNOWN";
  const arabicLabel = labelMap[key] ?? key;
  const tone = toneMap[key] ?? "bg-stone-100 text-stone-600";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tone}`}>{arabicLabel}</span>;
}

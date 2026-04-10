"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { AppInput } from "@/components/ui/app-input";
import { AppTextarea } from "@/components/ui/app-textarea";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingBlock } from "@/components/ui/loading-block";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { createVendorBid } from "@/lib/api/bids";
import { getRequestDetails } from "@/lib/api/requests";
import { useAsyncData } from "@/lib/hooks/use-async-data";

function VendorRequestDetails({ requestId }: { requestId: number }) {
  const { data, loading, error } = useAsyncData(() => getRequestDetails(requestId), [requestId]);
  const [description, setDescription] = useState("");
  const [netPrice, setNetPrice] = useState("100");
  const [message, setMessage] = useState<string | null>(null);

  async function submitBid(e: FormEvent) {
    e.preventDefault();
    try {
      const bid = await createVendorBid({ requestId, description, netPrice: Number(netPrice) });
      setMessage(`Bid ${bid.id} submitted with status ${bid.status}`);
      setDescription("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Bid creation failed");
    }
  }

  if (loading) return <LoadingBlock label="Loading request details" />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <ErrorState message="Request not found" />;

  return (
    <div className="space-y-4">
      <SectionHeader title={data.title} subtitle={data.address} />
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">Request status</p>
          <StatusBadge status={data.status} />
        </div>
        <p className="mt-2 text-sm text-slate-700">{data.description}</p>
      </div>

      <form onSubmit={submitBid} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold">Submit Bid</h3>
        <AppTextarea label="Bid Description" value={description} onChange={setDescription} />
        <AppInput label="Net Price" type="number" value={netPrice} onChange={setNetPrice} />
        <AppButton type="submit">Submit Bid</AppButton>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </form>
    </div>
  );
}

export default function VendorRequestDetailsPage() {
  const params = useParams<{ requestId: string }>();
  const parsed = Number(params.requestId);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return <ErrorState message="Invalid request id." />;
  }

  return <VendorRequestDetails requestId={parsed} />;
}

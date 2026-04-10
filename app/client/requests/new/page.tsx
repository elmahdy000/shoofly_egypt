"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { AppInput } from "@/components/ui/app-input";
import { AppTextarea } from "@/components/ui/app-textarea";
import { ErrorState } from "@/components/shared/error-state";
import { SectionHeader } from "@/components/ui/section-header";
import { createClientRequest } from "@/lib/api/requests";

export default function NewRequestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("30.0444");
  const [longitude, setLongitude] = useState("31.2357");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const created = await createClientRequest({
        title,
        description,
        categoryId: Number(categoryId),
        address,
        latitude: Number(latitude),
        longitude: Number(longitude),
        deliveryPhone,
        notes: notes || undefined,
      });
      router.push(`/client/requests/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request creation failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Create Request" subtitle="Submit a request for vendor bidding" />
      {error ? <ErrorState message={error} /> : null}

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <AppInput label="Title" value={title} onChange={setTitle} />
        <AppTextarea label="Description" value={description} onChange={setDescription} />
        <AppInput label="Category ID" value={categoryId} onChange={setCategoryId} type="number" />
        <AppInput label="Address" value={address} onChange={setAddress} />
        <div className="grid gap-3 sm:grid-cols-2">
          <AppInput label="Latitude" value={latitude} onChange={setLatitude} type="number" />
          <AppInput label="Longitude" value={longitude} onChange={setLongitude} type="number" />
        </div>
        <AppInput label="Delivery Phone" value={deliveryPhone} onChange={setDeliveryPhone} />
        <AppTextarea label="Notes" value={notes} onChange={setNotes} rows={3} />

        <AppButton type="submit" disabled={saving}>{saving ? "Submitting..." : "Submit Request"}</AppButton>
      </form>
    </div>
  );
}

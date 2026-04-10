import { AppCard } from "@/components/ui/app-card";
import { SectionHeader } from "@/components/ui/section-header";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Settings" subtitle="Platform settings shell" />
      <AppCard>
        <p className="text-sm text-slate-600">Commission %, vendor radius, and minimum vendor match settings are managed in DB.</p>
        <p className="mt-2 text-sm text-slate-500">This page is the Level 6 shell for those controls.</p>
      </AppCard>
    </div>
  );
}

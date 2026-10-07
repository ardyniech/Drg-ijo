import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { ActivityLogView } from "@/modules/activity-log";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/_authenticated/activity-log")({
  head: () => ({
    meta: [
      { title: "Log Aktivitas & Audit Trail — DRG App" },
      {
        name: "description",
        content: "Catatan riwayat tindakan transparan lintas peran di Komunitas DRG.",
      },
    ],
  }),
  component: ActivityLogPage,
});

function ActivityLogPage() {
  return (
    <PageShell
      eyebrow="Transparansi & Akuntabilitas"
      title="Log Aktivitas & Audit Trail Sistem"
      description="Rekaman kronologis riwayat tindakan pengurus & anggota lintas modul (SK Mandat, Keuangan, SOS, Piket, & Etik)."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-center gap-3">
          <Activity className="h-5 w-5 text-primary shrink-0" />
          <div>
            <span className="font-bold text-foreground">Jaminan Transparansi Lintas Peran:</span>{" "}
            Setiap tindakan yang memodifikasi data organisasi dicatat secara otomatis dengan stempel
            waktu dan identitas pelaku untuk audit internal.
          </div>
        </div>

        <ActivityLogView />
      </div>
    </PageShell>
  );
}

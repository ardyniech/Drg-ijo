import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import {
  SosQuickTrigger,
  IncidentCard,
  ReportIncidentDialog,
  useKejadian,
} from "@/modules/kejadian";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Siren, History } from "lucide-react";

export const Route = createFileRoute("/_authenticated/kejadian")({
  component: KejadianPage,
});

function KejadianPage() {
  const { incidents, isLoading } = useKejadian();
  const activeIncidents = incidents.filter(
    (i) => i.status === "aktif" || i.status === "dalam_penanganan",
  );
  const pastIncidents = incidents.filter(
    (i) => i.status === "selesai" || i.status === "dibatalkan",
  );

  return (
    <PageShell
      title="SOS & Kejadian Darurat"
      description="Pusat komando respons cepat darurat dan pelaporan insiden lapangan komunitas DRG."
      action={<ReportIncidentDialog />}
    >
      <div className="space-y-6">
        <SosQuickTrigger />

        <Tabs defaultValue="aktif" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm">
            <TabsTrigger value="aktif" className="gap-2">
              <Siren className="h-4 w-4 text-destructive" />
              <span>Insiden Berjalan ({activeIncidents.length})</span>
            </TabsTrigger>
            <TabsTrigger value="arsip" className="gap-2">
              <History className="h-4 w-4" />
              <span>Arsip Kasus ({pastIncidents.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aktif" className="space-y-4 pt-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Memuat data insiden...</p>
            ) : activeIncidents.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <p className="text-sm">
                  Tidak ada insiden aktif saat ini. Semua rekan dalam kondisi aman.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeIncidents.map((inc) => (
                  <IncidentCard key={inc.id} incident={inc} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="arsip" className="space-y-4 pt-4">
            {pastIncidents.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <p className="text-sm">Belum ada riwayat arsip insiden selesai.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pastIncidents.map((inc) => (
                  <IncidentCard key={inc.id} incident={inc} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}

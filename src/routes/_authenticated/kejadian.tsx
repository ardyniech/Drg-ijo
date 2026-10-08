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
      title="SOS & Pantau Jalur Darurat"
      description="Komando gercep satu aspal: respons cepat satgas, bantuan dulur mogok atau senggolan, dan koordinasi evakuasi jalur."
      action={<ReportIncidentDialog />}
    >
      <div className="space-y-6">
        <SosQuickTrigger />

        <Tabs defaultValue="aktif" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm">
            <TabsTrigger value="aktif" className="gap-2">
              <Siren className="h-4 w-4 text-destructive" />
              <span>Jalur Darurat Aktif ({activeIncidents.length})</span>
            </TabsTrigger>
            <TabsTrigger value="arsip" className="gap-2">
              <History className="h-4 w-4" />
              <span>Riwayat Bantuan Selesai ({pastIncidents.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aktif" className="space-y-4 pt-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Memuat data pantau jalur...</p>
            ) : activeIncidents.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <p className="text-sm">
                  Alhamdulillah jalur aman terkendali! Belum ada panggilan darurat dulur saat ini.
                  Tetap waspada & santui di jalan.
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

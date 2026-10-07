import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { NewNotulenDialog, NotulenCard, useNotulen } from "@/modules/notulen";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/notulen")({
  component: NotulenPage,
});

function NotulenPage() {
  const { notulenList, isLoading } = useNotulen();

  return (
    <PageShell
      title="Notulen Rapat & Musyawarah"
      description="Arsip resmi keputusan musyawarah, rapat koordinasi Satgas, dan AD/ART Komunitas DRG."
      action={<NewNotulenDialog />}
    >
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat arsip notulen...</p>
        ) : notulenList.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm">Belum ada notulen rapat yang tersimpan.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {notulenList.map((notulen) => (
              <NotulenCard key={notulen.id} notulen={notulen} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

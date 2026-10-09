import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { hasLocalAppData } from "@/modules/profil/logic/use-system-backup";
import { DatabaseZap, X, Download } from "lucide-react";

export function DashboardEmptyDataBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [hasData] = useState(() => hasLocalAppData());

  if (dismissed || hasData) return null;

  return (
    <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
      <div className="flex items-start gap-2.5">
        <DatabaseZap className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold text-foreground">
            Perangkat/origin ini kosong dari data organisasi.
          </p>
          <p className="text-xs text-muted-foreground">
            Data tersimpan lokal (localStorage) dan terikat ke URL aplikasi — jika URL preview
            berubah saat deploy ulang, data di URL lama tidak ikut terbawa.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
              <Link to="/pengaturan">
                <Download className="mr-1 h-3 w-3" /> Pulihkan Cadangan JSON
              </Link>
            </Button>
            <span className="text-[11px] text-muted-foreground">
              Sesi aktif tanpa data — maksudnya diawali origin baru atau data sengaja direset.
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="rounded-md p-1 text-muted-foreground hover:bg-amber-500/10 hover:text-foreground"
        aria-label="Tutup pemberitahuan"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

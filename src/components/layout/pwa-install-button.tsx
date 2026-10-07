import { useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={install}
        className="h-8 gap-1.5 rounded-full border-primary/40 bg-primary/5 text-xs font-medium text-primary hover:bg-primary/10"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Instal Aplikasi</span>
      </Button>
    );
  }

  if (isIOS) {
    return (
      <>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowIOSGuide(true)}
          className="h-8 gap-1.5 rounded-full border-primary/40 bg-primary/5 text-xs font-medium text-primary hover:bg-primary/10"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Instal di iOS</span>
        </Button>

        <Dialog open={showIOSGuide} onOpenChange={setShowIOSGuide}>
          <DialogContent className="max-w-sm rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Instal DRG App di iPhone</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Jalankan DRG seperti aplikasi native di iPhone Anda.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2 text-xs text-foreground">
              <div className="flex items-start gap-2.5 rounded-xl bg-muted/40 p-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono font-bold text-primary">
                  1
                </span>
                <p>
                  Ketuk tombol <strong>Share / Bagikan</strong> di bilah bawah peramban Safari.
                </p>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl bg-muted/40 p-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono font-bold text-primary">
                  2
                </span>
                <p>
                  Gulir ke bawah lalu pilih menu{" "}
                  <strong>Add to Home Screen (Tambah ke Layar Utama)</strong>.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
}

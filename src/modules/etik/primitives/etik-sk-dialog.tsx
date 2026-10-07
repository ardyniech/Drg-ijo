import { EtikCase } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Share2, Scale } from "lucide-react";
import { toast } from "sonner";

interface EtikSkDialogProps {
  item: EtikCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EtikSkDialog({ item, open, onOpenChange }: EtikSkDialogProps) {
  if (!item) return null;

  const noSk = `SK-ETIK/${item.caseNumber}/${new Date().getFullYear()}`;

  const handleCopySk = () => {
    const text =
      `*SURAT KEPUTUSAN DEWAN ETIK KOMUNITAS DRG*\n` +
      `Nomor: ${noSk}\n` +
      `Kasus: ${item.caseNumber} - ${item.category}\n` +
      `Terlapor: ${item.reportedMemberName} (${item.reportedMemberId})\n` +
      `Tingkat Pelanggaran: ${item.severity}\n` +
      `Status Akhir: ${item.status.toUpperCase()}\n` +
      `Keputusan / Sanksi: ${item.sanctionSummary || "Telah diselesaikan secara mediasi & kekeluargaan"}\n\n` +
      `_Ditetapkan resmi oleh Majelis Dewan Etik DRG._`;
    navigator.clipboard.writeText(text);
    if ("vibrate" in navigator) navigator.vibrate(60);
    toast.success("Teks SK Dewan Etik disalin ke clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Surat Keputusan (SK) Dewan Etik
              </DialogTitle>
              <p className="text-xs font-mono text-muted-foreground">{noSk}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 rounded-xl border border-border bg-card p-4 text-xs">
          <div className="text-center border-b border-border pb-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">
              DEWAN KEHORMATAN & ETIK DRG
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Berita Acara Keputusan Sidang Disiplin Anggota
            </p>
          </div>

          <div className="space-y-1.5 py-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nama Anggota:</span>
              <span className="font-semibold text-foreground">{item.reportedMemberName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID Anggota:</span>
              <span className="font-mono text-foreground">{item.reportedMemberId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kategori Pelanggaran:</span>
              <span className="font-semibold text-foreground">
                {item.category} (Tingkat {item.severity})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tanggal Kejadian:</span>
              <span className="text-foreground">{item.incidentDate}</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-3">
            <p className="font-semibold text-foreground mb-1">Amar Keputusan Sidang:</p>
            <p className="text-muted-foreground leading-relaxed">
              {item.sanctionSummary ||
                "Perkara dinyatakan selesai melalui proses mediasi kekeluargaan dan penandatanganan pakta integritas."}
            </p>
          </div>

          <div className="flex justify-between pt-4 border-t border-border text-[11px] text-muted-foreground">
            <div className="text-center">
              <p>Sekretaris Dewan Etik</p>
              <p className="mt-8 font-semibold text-foreground">( ........................ )</p>
            </div>
            <div className="text-center">
              <p>Ketua Dewan Etik</p>
              <p className="mt-8 font-semibold text-foreground">( Hendra Satgas )</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5">
            <Printer className="h-3.5 w-3.5" /> Cetak
          </Button>
          <Button
            size="sm"
            onClick={handleCopySk}
            className="gap-1.5 bg-primary text-primary-foreground"
          >
            <Share2 className="h-3.5 w-3.5" /> Bagikan SK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

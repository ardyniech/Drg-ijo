import { KasSkRecord, rupiah } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Printer, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { toast } from "sonner";

interface KasSkDialogProps {
  record: KasSkRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KasSkDialog({ record, open, onOpenChange }: KasSkDialogProps) {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
    toast.success("Mempersiapkan dokumen SK Kas untuk dicetak...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Surat Keputusan Kas Gotong Royong
                </DialogTitle>
                <p className="text-xs font-mono text-muted-foreground">{record.no_sk}</p>
              </div>
            </div>
            <Badge className={record.status === "dicairkan" ? "bg-emerald-600" : "bg-amber-600"}>
              {record.status === "dicairkan" ? "DICAIRKAN" : "DISAHKAN"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-5 font-sans">
          <div className="text-center border-b border-border/60 pb-3">
            <h4 className="font-bold text-sm text-foreground tracking-wide uppercase">
              KOMUNITAS DRIVER RIANG GEMBIRA (DRG)
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Badan Pengelola Kas Solidaritas & Kesejahteraan Satu Aspal
            </p>
            <p className="mt-2 text-xs font-mono font-semibold text-primary">{record.no_sk}</p>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-foreground">
            <p className="font-semibold text-primary flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-rose-500" /> {record.judul}
            </p>
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-background p-3 border border-border/60">
              <div>
                <span className="text-[11px] text-muted-foreground">Penerima Manfaat:</span>
                <p className="font-bold text-foreground">{record.penerima_nama}</p>
                <p className="text-[10px] text-muted-foreground">KTA: {record.penerima_kta}</p>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground">Pangkalan Asal:</span>
                <p className="font-semibold text-foreground">{record.penerima_pangkalan}</p>
                <p className="text-[10px] text-muted-foreground">Tanggal: {record.tanggal}</p>
              </div>
            </div>

            <div className="rounded-lg bg-background p-3 border border-border/60">
              <span className="text-[11px] text-muted-foreground">Nominal Disetujui:</span>
              <p className="text-xl font-bold font-mono text-emerald-600">
                {rupiah(record.nominal)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">Keperluan: {record.alasan}</p>
              <p className="text-[11px] text-muted-foreground">
                Dasar Hukum: {record.dasar_keputusan}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-3 text-center text-xs">
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">Bendahara Umum</p>
              <ShieldCheck className="mx-auto h-5 w-5 text-emerald-600" />
              <p className="font-semibold text-foreground">{record.nama_bendahara}</p>
              <p className="text-[9px] font-mono text-muted-foreground">Tanda Tangan Digital Sah</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">Ketua Umum DRG</p>
              <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-600" />
              <p className="font-semibold text-foreground">{record.nama_ketua}</p>
              <p className="text-[9px] font-mono text-muted-foreground">
                Pengesahan Organisasi Sah
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 bg-primary text-primary-foreground"
          >
            <Printer className="h-3.5 w-3.5" /> Cetak Salinan SK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

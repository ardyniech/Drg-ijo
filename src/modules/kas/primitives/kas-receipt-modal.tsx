import { Tx, rupiah, tierOf } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Share2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { formatNoKwitansi, formatTanggal, generateWaSlipText } from "../logic/kas-receipt-utils";

interface KasReceiptModalProps {
  tx: Tx | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KasReceiptModal({ tx, open, onOpenChange }: KasReceiptModalProps) {
  if (!tx) return null;

  const noKwitansi = formatNoKwitansi(tx.id);
  const tanggalFormat = formatTanggal(tx.tanggal);

  const handleCopyWa = () => {
    navigator.clipboard.writeText(generateWaSlipText(tx));
    if ("vibrate" in navigator) navigator.vibrate(60);
    toast.success("Teks slip transaksi disalin! Siap dikirim ke WhatsApp.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Kwitansi Kas Satu Aspal</DialogTitle>
              <p className="text-xs text-muted-foreground font-mono">{noKwitansi}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-xs text-muted-foreground">Status Sahin</span>
            <Badge
              className={
                tx.status === "disetujui" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
              }
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />{" "}
              {tx.status === "disetujui" ? "SAH DIVERIFIKASI" : "MENUNGGU REMBUG"}
            </Badge>
          </div>

          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Nominal Urunan
            </p>
            <p
              className={`text-2xl font-bold font-mono ${tx.jenis === "masuk" ? "text-emerald-600" : "text-amber-600"}`}
            >
              {tx.jenis === "masuk" ? "+" : "-"}
              {rupiah(Number(tx.jumlah))}
            </p>
            {tierOf(Number(tx.jumlah)) && (
              <Badge variant="outline" className="mt-1 text-[11px]">
                {tierOf(Number(tx.jumlah))?.label}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/60 pt-3">
            <div>
              <p className="text-muted-foreground">Kategori</p>
              <p className="font-semibold text-foreground">{tx.kategori || "Umum"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Buku Kas</p>
              <p className="font-semibold text-foreground capitalize">{tx.ledger}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tanggal</p>
              <p className="font-semibold text-foreground">{tanggalFormat}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Keterangan</p>
              <p className="font-semibold text-foreground">{tx.deskripsi || "—"}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button
            size="sm"
            onClick={handleCopyWa}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Share2 className="h-3.5 w-3.5" /> Salin ke WA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

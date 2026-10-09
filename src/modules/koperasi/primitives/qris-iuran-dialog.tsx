import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, CheckCircle2, ShieldCheck, Download } from "lucide-react";
import { toast } from "sonner";
import { rupiah } from "@/modules/kas";

export function QrisIuranDialog() {
  const [open, setOpen] = useState(false);
  const [nominal, setNominal] = useState(25000);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const refCode = `QRIS-DRG-${Date.now().toString(36).toUpperCase()}`;

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      toast.success("Pembayaran Iuran QRIS berhasil diverifikasi masuk kas!");
    }, 1200);
  };

  const resetState = (op: boolean) => {
    setOpen(op);
    if (!op) {
      setIsSuccess(false);
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={resetState}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
          <QrCode className="h-3.5 w-3.5 text-primary" /> Bayar Iuran QRIS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">QRIS Kas Gotong Royong DRG</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Standar Pembayaran Nasional (NMID: ID10260904581)
          </p>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-foreground">Pembayaran Berhasil!</h4>
            <p className="text-xs text-muted-foreground">
              Urunan kas sebesar <strong>{rupiah(nominal)}</strong> telah otomatis tercatat ke buku
              kas gotong royong.
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">Ref: {refCode}</p>
            <Button size="sm" onClick={() => resetState(false)} className="mt-3">
              Tutup & Kembali
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="flex justify-center gap-2">
              {[20000, 25000, 50000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setNominal(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    nominal === val
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {rupiah(val)}
                </button>
              ))}
            </div>

            <div className="mx-auto max-w-[220px] rounded-2xl border-2 border-foreground/10 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between border-b pb-1 text-[10px] font-bold text-slate-800">
                <span>QRIS</span>
                <span className="text-[9px] text-slate-500">GPN</span>
              </div>
              <div className="aspect-square w-full rounded-lg bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
                <QrCode className="h-32 w-32 text-slate-900" />
              </div>
              <p className="mt-2 text-[10px] font-bold text-slate-800">KAS SEDULUR DRG MALANG</p>
              <p className="font-mono text-[9px] text-slate-500">{refCode}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs">
              <Badge
                variant="outline"
                className="gap-1 border-emerald-500/30 text-emerald-700 bg-emerald-500/10"
              >
                <ShieldCheck className="h-3 w-3" /> Transaksi Aman & Instan
              </Badge>
            </div>

            <div className="flex justify-center gap-2 pt-1">
              <Button
                size="sm"
                onClick={handleSimulatePayment}
                disabled={isVerifying}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isVerifying ? "Memverifikasi..." : "Cek / Konfirmasi Bayar"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

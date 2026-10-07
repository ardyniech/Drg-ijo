import { useState } from "react";
import { ApprovalItem } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserCheck, CheckCircle2, XCircle, FileCheck2 } from "lucide-react";

interface ApprovalActionDialogProps {
  item: ApprovalItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
}

export function ApprovalActionDialog({
  item,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ApprovalActionDialogProps) {
  const [notes, setNotes] = useState("");

  if (!item) return null;

  const handleClose = () => {
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold">
            <UserCheck className="h-5 w-5 text-primary" />
            Verifikasi & Validasi Pengajuan
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Pemohon: <strong>{item.applicantName}</strong> ({item.applicantPhone})
          </p>
        </DialogHeader>

        <div className="space-y-3 my-2">
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jenis Pengajuan:</span>
              <span className="font-semibold text-foreground capitalize">
                {item.type.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kendaraan / Plat:</span>
              <span className="font-mono font-bold text-foreground">{item.plateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pangkalan Tujuan:</span>
              <span className="font-semibold text-primary">{item.appliedBase}</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-emerald-600">
              <FileCheck2 className="h-4 w-4" />
              <span>KTP, SIM & STNK Terunggah</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium">Catatan Verifikasi Admin</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan verifikasi atau alasan bila ditolak..."
              className="mt-1 h-20 text-xs rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between gap-2">
          <Button variant="ghost" onClick={handleClose} className="rounded-xl text-xs">
            Batal
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onReject(item.id, notes.trim() || undefined);
                handleClose();
              }}
              className="rounded-xl text-xs text-rose-600 border-rose-300 hover:bg-rose-50"
            >
              <XCircle className="mr-1.5 h-4 w-4" />
              Tolak
            </Button>
            <Button
              onClick={() => {
                onApprove(item.id, notes.trim() || undefined);
                handleClose();
              }}
              className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Setujui & Aktivasi
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

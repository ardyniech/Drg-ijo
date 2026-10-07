import { NewEtikCasePayload } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldAlert } from "lucide-react";
import { EtikReportForm } from "./etik-report-form";

interface EtikReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: NewEtikCasePayload) => void;
}

export function EtikReportDialog({ open, onOpenChange, onSubmit }: EtikReportDialogProps) {
  const handleSubmit = (payload: NewEtikCasePayload) => {
    onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold text-rose-600">
            <ShieldAlert className="h-5 w-5" />
            Lapor Dugaan Pelanggaran Etik
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Laporan akan diverifikasi langsung oleh Satgas Dewan Etik Komunitas.
          </p>
        </DialogHeader>

        <EtikReportForm onCancel={() => onOpenChange(false)} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { EtikCase, EtikStatus } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scale, CheckCircle2 } from "lucide-react";

interface EtikActionDialogProps {
  item: EtikCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: EtikStatus, notes?: string) => void;
}

export function EtikActionDialog({
  item,
  open,
  onOpenChange,
  onUpdateStatus,
}: EtikActionDialogProps) {
  const [status, setStatus] = useState<EtikStatus>(item?.status || "investigating");
  const [notes, setNotes] = useState("");

  if (!item) return null;

  const handleSave = () => {
    onUpdateStatus(item.id, status, notes);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold">
            <Scale className="h-5 w-5 text-primary" />
            Tindak Lanjut Sidang Etik
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Perkara: <strong>{item.caseNumber}</strong> - {item.reportedMemberName}
          </p>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium">Status Putusan Sidang</label>
            <Select value={status} onValueChange={(v) => setStatus(v as EtikStatus)}>
              <SelectTrigger className="mt-1 h-9 text-xs rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="investigating">Penyelidikan / Verifikasi Bukti</SelectItem>
                <SelectItem value="mediation_scheduled">Jadwal Mediasi Korlap</SelectItem>
                <SelectItem value="sanctioned">Dikenakan Sanksi Disiplin</SelectItem>
                <SelectItem value="resolved">Selesai / Rekonsiliasi Damai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium">Berita Acara / Ringkasan Putusan</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan keputusan musyawarah, hasil mediasi, atau klausul sanksi..."
              className="mt-1 h-24 text-xs rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Batal
          </Button>
          <Button onClick={handleSave} className="gap-1.5 rounded-xl text-xs bg-primary">
            <CheckCircle2 className="h-4 w-4" />
            Simpan Putusan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

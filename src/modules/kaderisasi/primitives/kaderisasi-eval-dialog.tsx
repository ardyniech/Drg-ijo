import { useState } from "react";
import { MemberKaderisasi } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";

interface KaderisasiEvalDialogProps {
  member: MemberKaderisasi | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPromote: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
}

export function KaderisasiEvalDialog({
  member,
  open,
  onOpenChange,
  onPromote,
  onReject,
}: KaderisasiEvalDialogProps) {
  const [notes, setNotes] = useState("");

  if (!member) return null;

  const handleClose = () => {
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Sidang Pleno Kaderisasi
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Evaluasi kenaikan jenjang untuk <strong>{member.fullName}</strong> ({member.memberId}).
          </p>
        </DialogHeader>

        <div className="my-3 space-y-3">
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
            <h4 className="text-xs font-semibold text-foreground">Kriteria Syarat Jenjang:</h4>
            <div className="mt-2 space-y-1.5">
              {member.requirements.map((req) => (
                <div key={req.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {req.met ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
                      {req.label}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-medium text-muted-foreground">
                    +{req.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">
              Catatan Dewan Kaderisasi / Berita Acara
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan rekomendasi, pertimbangan dewan, atau poin pembinaan..."
              className="mt-1.5 h-20 text-xs"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="rounded-xl text-xs"
          >
            Tutup
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onReject(member.id, notes.trim() || undefined);
                handleClose();
              }}
              className="rounded-xl text-xs text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              <XCircle className="mr-1.5 h-4 w-4" />
              Perlu Pembinaan
            </Button>
            <Button
              type="button"
              onClick={() => {
                onPromote(member.id, notes.trim() || undefined);
                handleClose();
              }}
              className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Sahkan Kenaikan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

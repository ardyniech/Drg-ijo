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
import { CheckCircle2, XCircle, AlertTriangle, Bike } from "lucide-react";
import { getOjolJenjang } from "@/lib/ojol-jenjang";

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

  const currentOjol = getOjolJenjang(member.currentLevel);
  const targetOjol = getOjolJenjang(member.targetLevel);

  const handleClose = () => {
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold">
            <Bike className="h-5 w-5 text-primary" />
            Musyawarah Kenaikan Tingkat Aspal
          </DialogTitle>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Dulur <strong>{member.fullName}</strong> ({member.memberId})
            </p>
            <p className="text-[11px] font-medium text-primary">
              Proyeksi: {currentOjol.title} ({currentOjol.nickname}) → {targetOjol.title} (
              {targetOjol.nickname})
            </p>
          </div>
        </DialogHeader>

        <div className="my-3 space-y-3">
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
            <h4 className="text-xs font-semibold text-foreground">
              Kriteria Jam Terbang & Solidaritas:
            </h4>
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
              Catatan Rembug Pangkalan & Suhu Aspal
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan apresiasi, masukan jalur, atau pesan sedulur santui..."
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
            Batal
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onReject(member.id, notes.trim() || undefined);
                handleClose();
              }}
              className="rounded-xl text-xs text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              <XCircle className="mr-1.5 h-4 w-4" />
              Perlu Jam Terbang
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
              Gas Loloskan Kenaikan!
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

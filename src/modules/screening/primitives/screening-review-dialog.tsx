import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ScreeningApplication, ScreeningStatus } from "../types";
import { CandidateDetailCard } from "./candidate-detail-card";
import { CandidateAnswersList } from "./candidate-answers-list";
import { CandidateAuditHistory } from "./candidate-audit-history";
import { useScreeningReview } from "../logic/use-screening-review";

interface Props {
  app: ScreeningApplication | null;
  onClose: () => void;
}

export function ScreeningReviewDialog({ app, onClose }: Props) {
  const { status, setStatus, catatan, setCatatan, answers, audit, save } = useScreeningReview(
    app,
    onClose,
  );

  return (
    <Dialog open={!!app} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review — {app?.nama}</DialogTitle>
          <DialogDescription>
            Skor: <strong>{app?.skor_total ?? 0}</strong>
            {app?.email_verified ? " · Email terverifikasi" : " · Email belum verifikasi"}
          </DialogDescription>
        </DialogHeader>
        {app && (
          <div className="space-y-4">
            <CandidateDetailCard app={app} />
            <CandidateAnswersList answers={answers} />

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as ScreeningStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menunggu">Menunggu</SelectItem>
                    <SelectItem value="wawancara">Perlu Wawancara</SelectItem>
                    <SelectItem value="direkomendasikan">Direkomendasikan</SelectItem>
                    <SelectItem value="ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Catatan PIC</Label>
                <Textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={2} />
              </div>
            </div>

            <CandidateAuditHistory audit={audit} />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

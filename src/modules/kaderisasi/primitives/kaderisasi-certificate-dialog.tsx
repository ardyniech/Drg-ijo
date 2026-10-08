import { MemberKaderisasi } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Printer, Share2, Bike } from "lucide-react";
import { getOjolJenjang } from "@/lib/ojol-jenjang";
import { toast } from "sonner";

interface KaderisasiCertificateDialogProps {
  member: MemberKaderisasi | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KaderisasiCertificateDialog({
  member,
  open,
  onOpenChange,
}: KaderisasiCertificateDialogProps) {
  if (!member) return null;

  const ojolMeta = getOjolJenjang(member.currentLevel);
  const noCert = `ASPAL-DRG/${ojolMeta.badgeLabel.toUpperCase()}/${member.memberId}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text =
      `*PIAGAM KELUARGA BESAR SATU ASPAL DRG*\n` +
      `No. Dokumen: ${noCert}\n` +
      `Diberikan Kepada: ${member.fullName} (${member.memberId})\n` +
      `Tingkat Aspal: ${ojolMeta.title} (${ojolMeta.nickname})\n` +
      `Motto Dulur: "${ojolMeta.roadQuote}"\n` +
      `Poin Solidaritas: ${member.points}/100\n` +
      `Piket Basecamp: ${member.piketAttendanceCount} Shift\n` +
      `Kepatuhan Kas: ${member.kasCompliancePercent}%\n\n` +
      `_Tercatat Resmi di Basecamp Pusat Driver Riang Gembira (DRG) • Salam Satu Aspal Santui_`;
    navigator.clipboard.writeText(text);
    if ("vibrate" in navigator) navigator.vibrate(60);
    toast.success("Piagam aspal disalin ke clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Piagam Tingkat Satu Aspal</DialogTitle>
              <p className="text-xs font-mono text-muted-foreground">{noCert}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-amber-500/10 p-5 text-center shadow-inner space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
            <Bike className="h-3.5 w-3.5" />
            <span>KELUARGA BESAR DRIVER RIANG GEMBIRA (DRG)</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-foreground">PIAGAM TINGKAT ASPAL</h3>
          <p className="text-xs text-muted-foreground">
            Dengan bangga menganugerahkan predikat aspal santui:
          </p>
          <div className="inline-block rounded-xl bg-amber-500/20 px-4 py-2 border border-amber-500/30">
            <div className="font-display text-base font-bold text-amber-800 dark:text-amber-300">
              {ojolMeta.title}
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              "{ojolMeta.nickname}"
            </div>
          </div>

          <p className="text-xs italic text-muted-foreground px-4">"{ojolMeta.roadQuote}"</p>

          <div className="pt-2 text-xs">
            <p className="text-muted-foreground">Dianugerahkan Kepada Dulur:</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{member.fullName}</p>
            <p className="text-xs font-mono text-muted-foreground">ID: {member.memberId}</p>
          </div>

          <div className="pt-3 border-t border-amber-500/20 text-[10px] text-muted-foreground flex justify-between">
            <div>
              <p>Merapat Sejak</p>
              <p className="font-semibold text-foreground">{member.joinedAt}</p>
            </div>
            <div>
              <p>Piket Basecamp</p>
              <p className="font-semibold text-foreground">{member.piketAttendanceCount} Shift</p>
            </div>
            <div>
              <p>Kepatuhan Kas</p>
              <p className="font-semibold text-foreground">{member.kasCompliancePercent}%</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-3.5 w-3.5" /> Cetak Piagam
          </Button>
          <Button
            size="sm"
            onClick={handleShare}
            className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Share2 className="h-3.5 w-3.5" /> Bagikan Dulur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { MemberKaderisasi } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Printer, Share2 } from "lucide-react";
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

  const noCert = `KAD-DRG/${member.currentLevel.toUpperCase()}/${member.memberId}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text =
      `*SERTIFIKAT KADERISASI KOMUNITAS DRG*\n` +
      `No. Dokumen: ${noCert}\n` +
      `Diberikan Kepada: ${member.fullName} (${member.memberId})\n` +
      `Jenjang: Tingkat ${member.currentLevel}\n` +
      `Poin Keaktifan: ${member.points}/100\n` +
      `Kehadiran Piket: ${member.piketAttendanceCount} Sesi\n` +
      `Kepatuhan Kas: ${member.kasCompliancePercent}%\n\n` +
      `_Tercatat dalam Buku Induk Kaderisasi Komunitas Driver Riang Gembira (DRG)_`;
    navigator.clipboard.writeText(text);
    if ("vibrate" in navigator) navigator.vibrate(60);
    toast.success("Info sertifikat disalin ke clipboard!");
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
              <DialogTitle className="text-base font-bold">
                Sertifikat Jenjang Kaderisasi
              </DialogTitle>
              <p className="text-xs font-mono text-muted-foreground">{noCert}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-amber-500/10 p-5 text-center shadow-inner">
          <div className="text-[10px] font-bold tracking-widest text-amber-700 uppercase">
            KOMUNITAS DRIVER RIANG GEMBIRA (DRG)
          </div>
          <h3 className="mt-1 font-serif text-lg font-bold text-foreground">
            SERTIFIKAT KADERISASI
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Dengan bangga menganugerahkan predikat:
          </p>
          <div className="my-3 inline-block rounded-xl bg-amber-500/20 px-4 py-1.5 font-display text-base font-bold text-amber-800">
            Anggota {member.currentLevel}
          </div>
          <p className="text-xs text-muted-foreground">Kepada Anggota:</p>
          <p className="text-sm font-bold text-foreground">{member.fullName}</p>
          <p className="text-xs font-mono text-muted-foreground">ID: {member.memberId}</p>
          <div className="mt-4 pt-3 border-t border-amber-500/20 text-[10px] text-muted-foreground flex justify-between">
            <div>
              <p>Bergabung</p>
              <p className="font-semibold text-foreground">{member.joinedAt}</p>
            </div>
            <div>
              <p>Total Piket</p>
              <p className="font-semibold text-foreground">{member.piketAttendanceCount} Sesi</p>
            </div>
            <div>
              <p>Kepatuhan Kas</p>
              <p className="font-semibold text-foreground">{member.kasCompliancePercent}%</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-3.5 w-3.5" /> Cetak
          </Button>
          <Button
            size="sm"
            onClick={handleShare}
            className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Share2 className="h-3.5 w-3.5" /> Bagikan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

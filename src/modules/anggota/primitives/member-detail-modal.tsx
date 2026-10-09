import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MemberRecord } from "../types";
import { MemberStatusBadge } from "./member-status-badge";
import { MemberJenjangBadge } from "./member-jenjang-badge";
import { DigitalKtaModal } from "./digital-kta-modal";
import { getOjolJenjang } from "@/lib/ojol-jenjang";
import { Phone, MapPin, Bike, ShieldCheck, FileText, Edit2 } from "lucide-react";

interface MemberDetailModalProps {
  member: MemberRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (id: string) => void;
  canVerify?: boolean;
  onEdit?: (member: MemberRecord) => void;
  canManage?: boolean;
}

export function MemberDetailModal({
  member,
  isOpen,
  onClose,
  onVerify,
  canVerify = false,
  onEdit,
  canManage = false,
}: MemberDetailModalProps) {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-4">
            <DialogTitle className="text-base font-semibold text-foreground">
              Profil Driver
            </DialogTitle>
            <MemberStatusBadge status={member.status} />
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Informasi santui sedulur: profil, status keanggotaan, dan amanah di satu aspal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="rounded-lg bg-muted/40 p-3 border border-border/70 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Nama Lengkap</span>
              <span className="font-semibold text-foreground">{member.nama}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Nomor KTA</span>
              <span className="font-mono font-medium text-primary">{member.no_kta}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amanah</span>
              <span className="font-medium capitalize">{member.role.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tingkat Aspal Santui</span>
              <MemberJenjangBadge jenjang={member.jenjang} size="sm" showNickname />
            </div>
            <div className="rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground italic border border-border/50">
              "{getOjolJenjang(member.jenjang).roadQuote}"
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border/70 p-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Pangkalan
              </div>
              <p className="font-medium text-foreground truncate">
                {member.pangkalan || "Belum diatur"}
              </p>
            </div>
            <div className="rounded-lg border border-border/70 p-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                <Bike className="h-3.5 w-3.5 text-primary" /> Kendaraan & Plat
              </div>
              <p className="font-medium text-foreground truncate font-mono">
                {member.plat_nomor || "N ---- XX"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{member.jenis_kendaraan}</p>
            </div>
          </div>

          {member.catatan && (
            <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-2.5 text-[11px] text-foreground flex items-start gap-1.5">
              <FileText className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{member.catatan}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/70 gap-2">
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${member.no_hp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
              >
                <Phone className="h-3.5 w-3.5" /> WhatsApp
              </a>
              <DigitalKtaModal member={member} />
            </div>
            <div className="flex items-center gap-1.5">
              {canManage && onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    onEdit(member);
                  }}
                  className="gap-1.5 text-xs h-8"
                >
                  <Edit2 className="h-3.5 w-3.5 text-primary" /> Edit
                </Button>
              )}
              {canVerify && member.status === "pending_review" && onVerify && (
                <Button
                  size="sm"
                  onClick={() => onVerify(member.id)}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Verifikasi
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

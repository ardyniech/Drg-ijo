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
import { DigitalKtaModal } from "./digital-kta-modal";
import { MemberDetailInfo } from "./member-detail-info";
import { Phone, ShieldCheck, Edit2 } from "lucide-react";

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
          <MemberDetailInfo member={member} />

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

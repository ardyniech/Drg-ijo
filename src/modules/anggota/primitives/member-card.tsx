import { useState } from "react";
import { Phone, MapPin, Award, Bike, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MemberRecord } from "../types";
import { MemberStatusBadge } from "./member-status-badge";
import { DigitalKtaModal } from "./digital-kta-modal";
import { MemberCardActions } from "./member-card-actions";
import { toast } from "sonner";

interface MemberCardProps {
  member: MemberRecord;
  onSelect?: (member: MemberRecord) => void;
  onEdit?: (member: MemberRecord) => void;
  onDelete?: (member: MemberRecord) => void;
  canManage?: boolean;
}

export function MemberCard({ member, onSelect, onEdit, onDelete, canManage }: MemberCardProps) {
  const [copied, setCopied] = useState(false);
  const initial = member.nama.charAt(0).toUpperCase();

  const handleCopyKta = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(member.no_kta);
    setCopied(true);
    toast.success(`Nomor KTA ${member.no_kta} disalin`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      onClick={() => onSelect?.(member)}
      className="group relative border border-border/80 bg-card hover:border-primary/50 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 border border-border shrink-0 bg-primary/5">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {member.nama}
              </h4>
              <button
                type="button"
                onClick={handleCopyKta}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono hover:text-foreground transition-colors mt-0.5"
                title="Salin No KTA"
              >
                <span>{member.no_kta}</span>
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3 opacity-60" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <MemberStatusBadge status={member.status} size="sm" />
            {canManage && (
              <MemberCardActions
                member={member}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 space-y-3 text-xs flex-1 flex flex-col justify-between">
        <div className="space-y-1.5 pt-1 text-muted-foreground">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate">{member.pangkalan}</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
              <Award className="h-3 w-3 shrink-0" />
              <span className="capitalize">{member.jenjang}</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/60">
            <span className="flex items-center gap-1 truncate font-mono">
              <Bike className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="truncate">{member.plat_nomor}</span>
            </span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
              {member.jenis_kendaraan}
            </span>
          </div>
        </div>

        <div
          className="flex items-center justify-between pt-2.5 border-t border-border/60"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={`https://wa.me/${member.no_hp}?text=Halo%20rekan%20${encodeURIComponent(member.nama)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Phone className="h-3 w-3" /> WhatsApp
          </a>
          <DigitalKtaModal member={member} />
        </div>
      </CardContent>
    </Card>
  );
}

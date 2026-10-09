import { useState } from "react";
import { Copy, Check, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MemberRecord } from "../types";
import { MemberStatusBadge } from "./member-status-badge";
import { MemberJenjangBadge } from "./member-jenjang-badge";
import { MemberRowActions } from "./member-row-actions";
import { toast } from "sonner";

interface Props {
  member: MemberRecord;
  canManage?: boolean;
  canVerify?: boolean;
  onVerifyMember?: (id: string) => void;
  onSelectMember?: (member: MemberRecord) => void;
  onEditMember?: (member: MemberRecord) => void;
  onDeleteMember?: (member: MemberRecord) => void;
}

export function MemberTableRow({
  member: m,
  canManage,
  canVerify,
  onVerifyMember,
  onSelectMember,
  onEditMember,
  onDeleteMember,
}: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyKta = (noKta: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(noKta);
    setCopiedId(noKta);
    toast.success(`No KTA ${noKta} disalin`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <tr
      onClick={() => onSelectMember?.(m)}
      className="hover:bg-muted/30 transition-colors cursor-pointer group"
    >
      <td className="py-2.5 px-3.5">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 border border-border shrink-0 bg-primary/5">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {m.nama.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {m.nama}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{m.no_hp || "-"}</p>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3">
        <button
          type="button"
          onClick={(e) => handleCopyKta(m.no_kta, e)}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
          title="Salin No KTA"
        >
          <span>{m.no_kta}</span>
          {copiedId === m.no_kta ? (
            <Check className="h-3 w-3 text-emerald-600" />
          ) : (
            <Copy className="h-3 w-3 opacity-60" />
          )}
        </button>
      </td>
      <td className="py-2.5 px-3 font-medium text-foreground">{m.pangkalan}</td>
      <td className="py-2.5 px-3">
        <MemberJenjangBadge jenjang={m.jenjang} size="sm" />
        <span className="text-[10px] text-muted-foreground block capitalize mt-0.5">
          {m.role.replace("_", " ")}
        </span>
      </td>
      <td className="py-2.5 px-3">
        <span className="font-mono text-[11px] font-medium">{m.plat_nomor}</span>
        <span className="text-[10px] text-muted-foreground block truncate max-w-[100px]">
          {m.jenis_kendaraan}
        </span>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <MemberStatusBadge status={m.status} size="sm" />
          {canVerify && m.status === "pending_review" && onVerifyMember && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onVerifyMember(m.id);
              }}
              className="h-6 px-1.5 text-[10px] text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              title="Verifikasi Driver"
            >
              <ShieldCheck className="h-3 w-3 mr-0.5" /> Verif
            </Button>
          )}
        </div>
      </td>
      <td className="py-2.5 px-3.5 text-right" onClick={(e) => e.stopPropagation()}>
        <MemberRowActions
          member={m}
          canManage={canManage}
          onEditMember={onEditMember}
          onDeleteMember={onDeleteMember}
        />
      </td>
    </tr>
  );
}

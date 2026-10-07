import { MemberRoleRecord } from "../types";
import { AVAILABLE_ROLES } from "../constants";

interface Props {
  member: MemberRoleRecord;
}

export function RoleMemberPreviewCard({ member }: Props) {
  const currentDef = AVAILABLE_ROLES.find((r) => r.id === member.role);

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <div className="text-[11px] text-muted-foreground">Anggota Terpilih:</div>
      <div className="font-bold text-foreground text-sm">{member.nama}</div>
      <div className="text-[11px] text-muted-foreground font-mono">
        {member.email} · {member.pangkalan}
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground">Peran Saat Ini:</span>
        <span className="font-semibold text-foreground">{currentDef?.name}</span>
      </div>
    </div>
  );
}

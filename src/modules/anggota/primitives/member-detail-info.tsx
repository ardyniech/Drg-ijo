import { MemberRecord } from "../types";
import { MemberJenjangBadge } from "./member-jenjang-badge";
import { getOjolJenjang } from "@/lib/ojol-jenjang";
import { MapPin, Bike, FileText } from "lucide-react";

export function MemberDetailInfo({ member }: { member: MemberRecord }) {
  return (
    <>
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
    </>
  );
}

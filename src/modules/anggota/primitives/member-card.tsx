import { Phone, MapPin, Award } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MemberRecord } from "../types";
import { DigitalKtaModal } from "./digital-kta-modal";

const ROLE_BADGES: Record<string, { label: string; color: string }> = {
  ketua: { label: "Ketua Umum", color: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
  sekretaris: { label: "Sekretaris", color: "bg-blue-500/15 text-blue-700 border-blue-500/30" },
  bendahara: {
    label: "Bendahara",
    color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  },
  admin: { label: "Admin Sistem", color: "bg-purple-500/15 text-purple-700 border-purple-500/30" },
  korlap: {
    label: "Korlap Satgas",
    color: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  },
  satgas: { label: "Satgas Lapangan", color: "bg-rose-500/15 text-rose-700 border-rose-500/30" },
  dewan_etik: {
    label: "Dewan Etik",
    color: "bg-indigo-500/15 text-indigo-700 border-indigo-500/30",
  },
  anggota: { label: "Anggota Driver", color: "bg-slate-500/15 text-slate-700 border-slate-500/30" },
  driver: { label: "Anggota Driver", color: "bg-slate-500/15 text-slate-700 border-slate-500/30" },
};

export function MemberCard({ member }: { member: MemberRecord }) {
  const role = ROLE_BADGES[member.role] || {
    label: member.role,
    color: "bg-muted text-muted-foreground",
  };
  const initial = member.nama.charAt(0).toUpperCase();

  return (
    <Card className="border-border/70 hover:border-primary/40 transition-colors">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-sm leading-none">{member.nama}</h4>
              <p className="text-xs text-muted-foreground font-mono mt-1">{member.no_kta}</p>
            </div>
          </div>
          <Badge className={role.color}>{role.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-1 space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 text-primary shrink-0" />
            <span className="truncate">{member.pangkalan}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-3 w-3 text-emerald-600 shrink-0" />
            <span>Kader {member.jenjang}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <a
            href={`https://wa.me/${member.no_hp}?text=Halo%20rekan%20${encodeURIComponent(member.nama)},%20salam%20satu%20aspal%20dari%20komunitas%20DRG.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <Phone className="h-3 w-3" /> WhatsApp
          </a>
          <DigitalKtaModal member={member} />
        </div>
      </CardContent>
    </Card>
  );
}

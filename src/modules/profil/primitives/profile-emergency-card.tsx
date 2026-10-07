import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, AlertTriangle, UserCheck, ShieldAlert } from "lucide-react";
import { ProfileRow } from "../types";

interface Props {
  profile: ProfileRow;
}

export function ProfileEmergencyCard({ profile }: Props) {
  const hpUtama = profile.no_hp || "-";
  const email = profile.email || "-";
  const daruratNama = profile.kontak_darurat_nama || "Belum diatur";
  const daruratHp = profile.kontak_darurat_hp || "Belum diatur";
  const daruratHub = profile.kontak_darurat_hubungan || "Keluarga";

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <Phone className="h-4 w-4 text-primary" />
          Kontak & Kontak Darurat (SOS)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/70 bg-card p-3 space-y-1">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Phone className="h-3 w-3 text-primary" /> Nomor HP / WhatsApp
            </span>
            <p className="font-semibold text-foreground text-sm">{hpUtama}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card p-3 space-y-1">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Mail className="h-3 w-3 text-primary" /> Email Terdaftar
            </span>
            <p className="font-medium text-foreground text-xs truncate">{email}</p>
          </div>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-destructive">
              <AlertTriangle className="h-4 w-4" /> Kontak Darurat Lapangan
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <ShieldAlert className="h-3 w-3 text-destructive" /> Hubungan: {daruratHub}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span className="text-[11px] text-muted-foreground">Nama Kontak</span>
              <p className="font-semibold text-foreground flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-primary" /> {daruratNama}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground">Nomor HP Darurat</span>
              <p className="font-mono font-bold text-destructive">{daruratHp}</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight pt-1 border-t border-destructive/20">
            Digunakan satgas dan pengurus saat kondisi darurat atau tombol SOS diaktifkan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

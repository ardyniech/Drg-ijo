import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Droplets, MapPin, AlignLeft, Award } from "lucide-react";
import { ProfileRow } from "../types";

interface Props {
  profile: ProfileRow;
}

export function ProfilePersonalCard({ profile }: Props) {
  const formattedDob = profile.tanggal_lahir
    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
        new Date(profile.tanggal_lahir),
      )
    : "Belum diisi";

  const genderLabel =
    profile.jenis_kelamin === "L"
      ? "Laki-laki"
      : profile.jenis_kelamin === "P"
        ? "Perempuan"
        : "Belum dipilih";

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <User className="h-4 w-4 text-primary" />
          Biodata Pribadi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3.5 text-sm">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">Nama Lengkap</span>
            <p className="font-semibold text-foreground">{profile.nama || "-"}</p>
          </div>
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" /> Tanggal Lahir
            </span>
            <p className="font-medium text-foreground">{formattedDob}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">Jenis Kelamin</span>
            <p className="font-medium text-foreground">{genderLabel}</p>
          </div>
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Droplets className="h-3 w-3 text-destructive" /> Gol. Darah
            </span>
            <p className="font-medium text-foreground">{profile.golongan_darah || "-"}</p>
          </div>
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Award className="h-3 w-3 text-primary" /> Jenjang Karir
            </span>
            <p className="font-medium capitalize text-foreground">{profile.jenjang}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">ID Anggota</span>
            <p className="font-mono text-xs font-semibold text-foreground">
              {profile.nomor_anggota || `DRG-${profile.id.slice(-4).toUpperCase()}`}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border/60 space-y-2">
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" /> Alamat Domisili
            </span>
            <p className="font-medium text-foreground leading-relaxed">
              {profile.alamat || "Alamat domisili belum dilengkapi."}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <AlignLeft className="h-3 w-3 text-muted-foreground" /> Catatan / Bio
            </span>
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              "{profile.bio || "Driver Komunitas Riang Gembira."}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

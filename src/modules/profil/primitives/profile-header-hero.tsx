import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Edit3, ShieldCheck, MapPin, Calendar, Car } from "lucide-react";
import { ProfileRow, getInitials } from "../types";

interface Props {
  profile: ProfileRow;
  roles: string[];
  onUploadAvatar: (file: File) => void;
  onOpenEdit: () => void;
}

export function ProfileHeaderHero({ profile, roles, onUploadAvatar, onOpenEdit }: Props) {
  const initials = getInitials(profile.nama ?? profile.email);
  const joinDate = profile.created_at
    ? new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(
        new Date(profile.created_at),
      )
    : "2024";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="relative group">
            {profile.foto_url ? (
              <img
                src={profile.foto_url}
                alt={profile.nama}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/20 shadow-md"
              />
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-warm font-display text-2xl font-bold text-primary-foreground shadow-warm">
                {initials}
              </div>
            )}
            <label
              htmlFor="hero-avatar"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-background border border-border shadow-xs hover:bg-muted text-foreground transition-transform active:scale-95"
              title="Ubah Foto Profil"
            >
              <Upload className="h-3.5 w-3.5" />
              <input
                id="hero-avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUploadAvatar(f);
                }}
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-display text-xl font-bold text-foreground">
                {profile.nama || "Anggota DRG"}
              </h2>
              <Badge variant="secondary" className="font-mono text-[11px]">
                {profile.nomor_anggota || `DRG-${profile.id.slice(-4).toUpperCase()}`}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{profile.email || "driver@drg.id"}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-0.5">
              <Badge className="bg-primary/15 text-primary hover:bg-primary/20 capitalize text-[11px]">
                {profile.jenjang}
              </Badge>
              <Badge variant="outline" className="capitalize text-[11px]">
                Status: {profile.status}
              </Badge>
              {roles.map((r) => (
                <Badge key={r} variant="secondary" className="text-[11px] capitalize">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {r}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="hidden lg:flex flex-col gap-1 text-right text-xs text-muted-foreground pr-4 border-r border-border/60">
            <span className="flex items-center gap-1.5 justify-end">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {profile.pangkalan || "Pangkalan Utama"}
            </span>
            <span className="flex items-center gap-1.5 justify-end">
              <Car className="h-3.5 w-3.5 text-primary" />
              {profile.plat_nomor || "Belum ada plat"}
            </span>
            <span className="flex items-center gap-1.5 justify-end">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Gabung {joinDate}
            </span>
          </div>
          <Button
            onClick={onOpenEdit}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Lengkap Biodata
          </Button>
        </div>
      </div>
    </div>
  );
}

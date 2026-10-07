import { Crown, Shield, Scale, Users } from "lucide-react";

interface Props {
  stats: {
    total: number;
    pengurusInti: number;
    satgasLapangan: number;
    dewanEtik: number;
    driverBiasa: number;
  };
}

export function RoleStatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pengurus Inti
          </span>
          <Crown className="h-4 w-4 text-amber-600" />
        </div>
        <div className="mt-2 text-2xl font-bold text-amber-600">{stats.pengurusInti}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Ketua, Sek, Bend, Admin</div>
      </div>

      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Satgas Lapangan
          </span>
          <Shield className="h-4 w-4 text-rose-600" />
        </div>
        <div className="mt-2 text-2xl font-bold text-rose-600">{stats.satgasLapangan}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Korlap & Petugas Siaga</div>
      </div>

      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dewan Etik
          </span>
          <Scale className="h-4 w-4 text-indigo-600" />
        </div>
        <div className="mt-2 text-2xl font-bold text-indigo-600">{stats.dewanEtik}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Pengawas Kode Etik</div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Driver Anggota
          </span>
          <Users className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-2 text-2xl font-bold text-foreground">{stats.driverBiasa}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">Total: {stats.total} anggota</div>
      </div>
    </div>
  );
}

import { rupiah } from "../types";
import { ShieldCheck, HeartHandshake, Building2, Users } from "lucide-react";

interface KasTransparencyStatsProps {
  summary: {
    totalSocial: number;
    totalCooperative: number;
    totalRelief: number;
    activeContributors: number;
    complianceRate: number;
  };
}

export function KasTransparencyStats({ summary }: KasTransparencyStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">Dana Sosial (Sosial)</span>
          <HeartHandshake className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-foreground">
          {rupiah(summary.totalSocial)}
        </div>
        <div className="mt-1 text-[11px] text-emerald-600 font-medium">Buku Kas Sosial Aktif</div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">Kas Koperasi (Umum)</span>
          <Building2 className="h-4 w-4 text-blue-600" />
        </div>
        <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-foreground">
          {rupiah(summary.totalCooperative)}
        </div>
        <div className="mt-1 text-[11px] text-blue-600 font-medium">Buku Kas Koperasi Aktif</div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">Penyaluran Bantuan</span>
          <ShieldCheck className="h-4 w-4 text-amber-600" />
        </div>
        <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-foreground">
          {rupiah(summary.totalRelief)}
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">Terverifikasi Transaksi Riil</div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">Kepatuhan Iuran</span>
          <Users className="h-4 w-4 text-purple-600" />
        </div>
        <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-foreground">
          {summary.complianceRate}%
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">
          {summary.activeContributors} Kontributor Terdaftar
        </div>
      </div>
    </div>
  );
}

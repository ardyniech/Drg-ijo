import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useDashboardOrg } from "@/modules/dashboard/logic/use-dashboard-org";
import { ShieldCheck, Cpu, Database, Activity } from "lucide-react";

export function AdminDashboardWidget() {
  const org = useDashboardOrg();

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-card p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/20 text-purple-600 shadow-xs">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Dashboard Administrator Sistem & Security Audit
            </h3>
            <p className="text-xs text-muted-foreground">
              Kesehatan penyimpanan lokal, audit log akun, & manajemen role pengurus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700" asChild>
            <Link to="/roles">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Manajemen Peran & SK
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Database className="h-3.5 w-3.5 text-purple-600" /> Penyimpanan Lokal
          </div>
          <div className="mt-1.5 text-xl font-bold text-purple-600">
            {org.members.length + org.txCount + org.pangkalanCount > 0 ? "Aktif" : "Kosong"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {org.members.length + org.txCount > 0 ? org.members.length + org.txCount : 0} catatan
            tersimpan di perangkat
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Activity className="h-3.5 w-3.5 text-emerald-600" /> Status Sesi Pengguna
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">
            {org.members.length > 0 ? `${org.members.length} Terdaftar` : "Belum Ada"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {org.pendingCount > 0
              ? `${org.pendingCount} menunggu verifikasi`
              : "Semua terverifikasi"}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Keamanan Peran
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">RBAC Aktif</div>
          <div className="text-[10px] text-muted-foreground">
            {org.roleCount > 0
              ? `${org.roleCount} kategori peran terpakai`
              : "Belum ada peran terisi"}
          </div>
        </div>
      </div>
    </div>
  );
}

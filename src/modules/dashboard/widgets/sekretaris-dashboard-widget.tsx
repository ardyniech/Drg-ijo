import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useDashboardOrg } from "@/modules/dashboard/logic/use-dashboard-org";
import { useNotulen } from "@/modules/notulen/logic/use-notulen";
import { usePersetujuan } from "@/modules/persetujuan/logic/use-persetujuan";
import { FileText, ClipboardCheck, FolderArchive, UserCheck } from "lucide-react";

export function SekretarisDashboardWidget() {
  const org = useDashboardOrg();
  const { notulenList = [] } = useNotulen();
  const { rawList = [] } = usePersetujuan();

  const verifikasi = rawList.filter((a) => a.status === "pending").length;

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-card p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-blue-500/20">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/20 text-blue-600 shadow-xs">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Dashboard Sekretaris Jenderal</h3>
            <p className="text-xs text-muted-foreground">
              Tata kelola notulen musyawarah, administrasi SK, & verifikasi berkas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-blue-500/40 text-blue-600 hover:bg-blue-500/10"
            asChild
          >
            <Link to="/notulen">
              <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" /> Buat Notulen Baru
            </Link>
          </Button>
          <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700" asChild>
            <Link to="/persetujuan">
              <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Verifikasi Berkas
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <FileText className="h-3.5 w-3.5 text-blue-600" /> Notulen Rapat
          </div>
          <div className="mt-1.5 text-xl font-bold text-blue-600">
            {notulenList.length > 0 ? `${notulenList.length} Berita Acara` : "Belum Ada"}
          </div>
          <div className="text-[10px] text-muted-foreground">Tersimpan di arsip ringkasan</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <FolderArchive className="h-3.5 w-3.5 text-primary" /> Surat Keputusan (SK)
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">
            {org.pengurusCount > 0 ? `${org.pengurusCount} Mandat` : "Belum Terbit"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            Pengurus aktif terdaftar di sistem
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" /> Verifikasi Berkas
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">
            {verifikasi > 0 ? `${verifikasi} Menunggu` : "Antrean Kosong"}
          </div>
          <div className="text-[10px] text-muted-foreground">Calon anggota & pengajuan masuk</div>
        </div>
      </div>
    </div>
  );
}

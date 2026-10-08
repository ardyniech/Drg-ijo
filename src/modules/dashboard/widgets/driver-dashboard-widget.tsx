import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { User, Wallet, Siren, Calendar } from "lucide-react";

export function DriverDashboardWidget() {
  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-card p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-primary/20">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/20 text-primary shadow-xs">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Dashboard Sedulur Driver Aktif</h3>
            <p className="text-xs text-muted-foreground">
              KTA digital, status kas gotong royong, & tombol bantuan darurat satu aspal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/10"
            asChild
          >
            <Link to="/profil">
              <User className="mr-1.5 h-3.5 w-3.5" /> KTA Digital Dulur
            </Link>
          </Button>
          <Button size="sm" className="bg-signal text-signal-foreground hover:bg-signal/90" asChild>
            <Link to="/kejadian">
              <Siren className="mr-1.5 h-3.5 w-3.5" /> Bantuan SOS Jalur
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Kas Seduluran
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">Tertib Lunas</div>
          <div className="text-[10px] text-muted-foreground">Kwitansi Digital Siap</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Calendar className="h-3.5 w-3.5 text-primary" /> Jadwal Jaga Jalur
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">Sabtu, Shift 1</div>
          <div className="text-[10px] text-muted-foreground">Basecamp Suhat</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <User className="h-3.5 w-3.5 text-amber-600" /> Tingkat Aspal
          </div>
          <div className="mt-1.5 text-xl font-bold text-amber-600">Suhu Gacor</div>
          <div className="text-[10px] text-muted-foreground">Jawara Aspal • Jam Terbang 2 Thn</div>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/use-me";
import { usePiket } from "@/modules/piket/logic/use-piket";
import { supabase } from "@/integrations/supabase/client";
import { formatRupiah } from "@/shared/utils/formatters";
import { User, Wallet, Siren, Calendar } from "lucide-react";
import { getOjolJenjang } from "@/lib/ojol-jenjang";

export function DriverDashboardWidget() {
  const { data: me } = useMe();
  const { shifts = [] } = usePiket(me?.id);

  const { data: profile } = useQuery({
    queryKey: ["profile-jenjang", me?.id],
    enabled: !!me?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("jenjang, pangkalan, status")
        .eq("id", me!.id)
        .maybeSingle();
      return data as { jenjang?: string | null; pangkalan?: string | null; status?: string | null };
    },
  });

  const { data: saldo = 0 } = useQuery({
    queryKey: ["kas-balance-total"],
    queryFn: async () => {
      const { data } = await supabase.rpc("kas_balances");
      const balances = (data ?? []) as Array<Record<string, unknown>>;
      return balances.reduce((acc, b) => acc + Number(b.saldo ?? 0), 0);
    },
  });

  const myShift = shifts.find((s) => s.user_id === me?.id);
  const jenjangMeta = getOjolJenjang(profile?.jenjang);

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
          <div className="mt-1.5 text-xl font-bold text-emerald-600">
            {saldo > 0 ? formatRupiah(saldo) : "Belum tercatat"}
          </div>
          <div className="text-[10px] text-muted-foreground">Buku kas terbuka & transparan</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Calendar className="h-3.5 w-3.5 text-primary" /> Jadwal Jaga Jalur
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">
            {myShift ? `${myShift.slot} · Shift` : "Belum Ada"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {myShift?.wilayah
              ? `${myShift.wilayah} · ${myShift.tanggal}`
              : "Hubungi Korlap untuk piket"}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <User className="h-3.5 w-3.5 text-amber-600" /> Tingkat Aspal
          </div>
          <div className="mt-1.5 text-lg leading-tight font-bold text-amber-600">
            {jenjangMeta.title}
            <span className="ml-1.5 text-[10px] font-medium text-muted-foreground">
              ({jenjangMeta.nickname})
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            {profile?.pangkalan
              ? `Berpangkalan ${profile.pangkalan}`
              : "Pangkalan belum ditetapkan"}
          </div>
          <div className="mt-1.5 text-[10px] italic text-primary/70">"{jenjangMeta.roadQuote}"</div>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, Users2, Landmark, Radio } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getShelters } from "@/modules/peta/storage/peta-storage";
import { formatRupiah } from "@/shared/utils/formatters";

export function LandingStats() {
  const { data: aktifCount = 0 } = useQuery({
    queryKey: ["landing", "anggota"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, status");
      return (data ?? []).filter((p: { status?: string }) => p.status === "aktif").length;
    },
  });

  const { data: kas = { saldo: 0, txCount: 0 } } = useQuery({
    queryKey: ["landing", "kas"],
    queryFn: async () => {
      const balRes = await supabase.rpc("kas_balances");
      const txRes = await supabase.from("kas_transactions").select("id");
      const saldo = ((balRes.data ?? []) as Array<Record<string, unknown>>).reduce(
        (acc, row) => acc + Number(row.saldo ?? 0),
        0,
      );
      return { saldo, txCount: (txRes.data ?? []).length };
    },
  });

  const { data: shelterCount = 0 } = useQuery({
    queryKey: ["landing", "shelters"],
    queryFn: async () => getShelters().length,
  });

  const stats = [
    {
      icon: Users2,
      value: aktifCount > 0 ? String(aktifCount) : "—",
      label: "Keluarga DRG",
      sub: "Rekan driver roda 2 & 4 yang terdata di pangkalan",
    },
    {
      icon: Landmark,
      value: kas.txCount > 0 ? formatRupiah(kas.saldo) : "Terbuka",
      label: "Buku Kas Terbuka",
      sub:
        kas.txCount > 0
          ? "Semua pencatatan bisa diaudit bareng-bareng"
          : "Dashboard pembukuan transparan untuk semua sedulur",
    },
    {
      icon: Radio,
      value: shelterCount > 0 ? String(shelterCount) : "—",
      label: "Posko & Shelter",
      sub: "Titik bertemu & istirahat yang terdaftar resmi",
    },
    {
      icon: ShieldAlert,
      value: "24/7",
      label: "Satgas Siaga",
      sub: "Kita jaga saudara kapanpun dibutuhkan",
    },
  ];

  return (
    <section
      id="transparansi"
      className="border-y border-border/60 bg-gradient-to-r from-primary/6 via-background to-primary/6 py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border/80 bg-card/95 p-8 shadow-sm backdrop-blur-sm md:p-12">
          <div className="mb-6 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              Bareng-Bareng Kita Jaga Satu Sama Lain
            </div>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Semangat kekeluargaan yang kita rawat tiap hari di jalan
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, idx) => (
              <div
                key={s.label}
                className={idx !== 0 ? "sm:border-l sm:border-border/60 sm:pl-6" : ""}
              >
                <div className="flex items-center gap-2 text-primary">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary shadow-sm">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                </div>
                <div className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl font-mono tabular-nums">
                  {s.value}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

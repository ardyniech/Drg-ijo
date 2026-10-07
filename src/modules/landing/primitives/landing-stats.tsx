import { ShieldAlert, Users2, Landmark, Radio } from "lucide-react";

export function LandingStats() {
  const stats = [
    {
      icon: Users2,
      value: "500+",
      label: "Pengemudi Aktif",
      sub: "Mitra Roda 2 & Roda 4 terverifikasi",
    },
    {
      icon: Landmark,
      value: "100%",
      label: "Audit Kas Terbuka",
      sub: "Laporan ledger dapat diakses anggota",
    },
    {
      icon: Radio,
      value: "12",
      label: "Posko & Shelter",
      sub: "Titik temu resmi se-Malang Raya",
    },
    {
      icon: ShieldAlert,
      value: "24/7",
      label: "Respons Satgas",
      sub: "Bantuan kecelakaan & mogok darurat",
    },
  ];

  return (
    <section id="transparansi" className="border-b border-border/60 bg-muted/20 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-sm md:p-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, idx) => (
              <div
                key={s.label}
                className={idx !== 0 ? "sm:border-l sm:border-border/60 sm:pl-6" : ""}
              >
                <div className="flex items-center gap-2 text-primary">
                  <s.icon className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                </div>
                <div className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl font-mono tabular-nums">
                  {s.value}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

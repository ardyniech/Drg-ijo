import { Wallet, Siren, CalendarCheck2, Award } from "lucide-react";

export function LandingFeatures() {
  const pillars = [
    {
      num: "01",
      icon: Wallet,
      title: "Kas Gotong Royong Terbuka",
      desc: "Setiap iuran seduluran, sumbangan santui, dan bantuan dulur musibah tercatat transparan dengan nomor kwitansi digital.",
    },
    {
      num: "02",
      icon: Siren,
      title: "Satgas Gercep & Radar SOS",
      desc: "Satu ketukan darurat langsung kirim koordinat GPS live ke dulur satgas terdekat untuk gercep tolong di jalan.",
    },
    {
      num: "03",
      icon: CalendarCheck2,
      title: "Piket Basecamp & Titik Kumpul",
      desc: "Jaga shelter pangkalan bareng-bareng. Absen radius basecamp santui & tukar shift fleksibel antar sedulur.",
    },
    {
      num: "04",
      icon: Award,
      title: "Tingkat Aspal & Marwah Guyub",
      desc: "Tingkat aspal dari Driver Anyar sampai Sesepuh, serta mediasi kekeluargaan jaga marwah keluarga besar DRG.",
    },
  ];

  return (
    <section id="pilar" className="border-b border-border/60 bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            Fondasi Seduluran
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Empat Pilar Gerakan Mandiri Driver Riang Gembira.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Dirancang dari driver, oleh driver, untuk persaudaraan erat dan saling jaga di aspal
            jalanan.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((item) => (
            <div
              key={item.num}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-muted-foreground/60">
                    {item.num}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

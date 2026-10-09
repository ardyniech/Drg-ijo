import { Wallet, Siren, CalendarCheck2, Award } from "lucide-react";

export function LandingFeatures() {
  const pillars = [
    {
      num: "01",
      icon: Wallet,
      title: "Kas Gotong Royong yang Terbuka",
      desc: "Kita nabung bareng, kita bantu bareng. Semua pemasukan & penyaluran santunan bisa dilihat jelas sama keluarga DRG.",
    },
    {
      num: "02",
      icon: Siren,
      title: "Satgas Siaga, Saling Jaga di Jalan",
      desc: "Kalo ada saudara kita butuh bantuan, tombol SOS langsung hubungin rekan piket terdekat. Kita nggak biarin saudara sendirian.",
    },
    {
      num: "03",
      icon: CalendarCheck2,
      title: "Piket Bareng, Adil Bareng",
      desc: "Jadwal piket dibagi rata sama kita semua. Check-in jelas, bisa tukar shift juga biar tetep guyub & nggak berat sebelah.",
    },
    {
      num: "04",
      icon: Award,
      title: "Kaderisasi & Etik, Jaga Marwah Bareng",
      desc: "Kita jaga nama baik keluarga besar DRG lewat pembinaan bareng dan penyelesaian masalah dengan hati yang rukun.",
    },
  ];

  return (
    <section id="pilar" className="border-b border-border/60 bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            Yang Bikin Kita Solid Bareng
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Kita Bangun Bareng, Jaga Bareng, Bantu Bareng
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base text-pretty leading-relaxed">
            Bukan cuma komunitas, tapi keluarga. Semua ini kita jaga bareng biar kehidupan di aspal
            makin aman, rukun & sejahtera.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((item) => (
            <div
              key={item.num}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-primary/15 bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-muted-foreground/60">
                    {item.num}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

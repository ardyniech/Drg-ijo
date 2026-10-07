import { Wallet, Siren, CalendarCheck2, Award } from "lucide-react";

export function LandingFeatures() {
  const pillars = [
    {
      num: "01",
      icon: Wallet,
      title: "Transparansi Kas & Buku Besar",
      desc: "Setiap pemasukan iuran wajib, sumbangan sukarela, dan penyaluran santunan tercatat terbuka dengan nomor kwitansi digital.",
    },
    {
      num: "02",
      icon: Siren,
      title: "Satgas Siaga & Radar SOS Darurat",
      desc: "Sinyal marabahaya satu sentuhan memancarkan koordinat GPS live ke posko satgas terdekat untuk pertolongan darurat di jalan.",
    },
    {
      num: "03",
      icon: CalendarCheck2,
      title: "Jadwal Piket & Absensi GPS",
      desc: "Distribusi piket shelter adil dan transparan. Check-in berbasis radius pangkalan resmi serta pertukaran shift mandiri.",
    },
    {
      num: "04",
      icon: Award,
      title: "Kaderisasi & Dewan Etik DRG",
      desc: "Penjenjangan keanggotaan terverifikasi dan sidang kode etik independen demi menjaga marwah dan kehormatan keluarga besar.",
    },
  ];

  return (
    <section id="pilar" className="border-b border-border/60 bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            Fondasi Organisasi
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Empat Pilar Gerakan Mandiri Driver Riang Gembira.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Dirancang dari driver, oleh driver, untuk kesejahteraan dan perlindungan bersama di
            aspal jalanan.
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

import { UserPlus, Users, Award } from "lucide-react";

export function LandingJoinSteps() {
  const steps = [
    {
      num: "01",
      icon: UserPlus,
      title: "Yuk Isi Dulu",
      desc: "Isi data singkat aja, nama, kontak, sama data kendaraan. Gak ribet kok.",
    },
    {
      num: "02",
      icon: Users,
      title: "Diperiksa Bareng",
      desc: "Tim kaderisasi kita bakal verifikasi singkat biar tetep terjaga kekeluargaan dan kehormatan kita bareng.",
    },
    {
      num: "03",
      icon: Award,
      title: "Resmi Jadi Keluarga DRG",
      desc: "Kalo udah disetujui, langsung bisa akses fitur kita bareng, siap saling jaga di aspal.",
    },
  ];

  return (
    <section id="gabung" className="border-b border-border/60 bg-muted/20 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary shadow-sm">
            Cara Gabung
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Gampang Banget Buat Gabung Jadi Keluarga DRG
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base text-pretty leading-relaxed">
            Kita buka pintunya lebar buat rekan-rekan driver. Prosesnya simpel, tetep dijaga bareng biar keluarga kita solid.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.num}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-primary/15 bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-muted-foreground/60">{s.num}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

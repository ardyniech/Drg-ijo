import { Info, ServerOff, Smartphone, KeyRound } from "lucide-react";

const notes = [
  {
    icon: ServerOff,
    title: "Belum ada server pusat",
    body: "Saat ini aplikasi berjalan sepenuhnya di peramban. Tidak ada database pusat, sehingga data tidak otomatis tersinkron antar perangkat atau antar dulur.",
  },
  {
    icon: Smartphone,
    title: "Data terikat perangkat",
    body: "Semua catatan tersimpan di penyimpanan lokal peramban. Ganti perangkat atau bersihkan data peramban, maka data perlu dipulihkan dari cadangan JSON.",
  },
  {
    icon: KeyRound,
    title: "Otorisasi masih di sisi antarmuka",
    body: "Pembatasan akses per peran saat ini dijalankan di sisi klien. Kontrol akses yang kuat perlu divalidasi di server pada pengembangan berikutnya.",
  },
];

export function AboutHonestyNote() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6 md:pb-16">
      <div className="rounded-2xl border border-warn/40 bg-warn/10 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-warn/40 bg-warn/20 text-warn-foreground">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Catatan Jujur Sebelum Dipakai
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
              Agar tidak salah paham, ini batasan nyata yang perlu diketahui bersama.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {notes.map((item) => (
            <div key={item.title} className="rounded-xl border border-border/70 bg-card p-4">
              <item.icon className="h-4 w-4 text-warn-foreground" />
              <h4 className="mt-2 text-sm font-semibold text-foreground">{item.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

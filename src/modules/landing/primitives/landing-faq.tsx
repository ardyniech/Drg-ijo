import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function LandingFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Siapa saja yang berhak mendaftar menjadi anggota DRG?",
      a: "Semua pengemudi transportasi online (ojek online R2 maupun taksi online R4) yang beroperasi aktif dan berkomitmen menjunjung tinggi nilai persaudaraan dan kejujuran.",
    },
    {
      q: "Bagaimana proses setelah mengisi formulir pendaftaran?",
      a: "Data Anda akan ditinjau langsung oleh tim PIC Kaderisasi. Anda akan dihubungi untuk wawancara singkat di shelter terdekat sebelum mendapatkan status Anggota Resmi.",
    },
    {
      q: "Bagaimana transparansi pengelolaan dana kas dan sosial?",
      a: "Setiap mutasi kas tercatat secara terbuka di buku besar digital aplikasi ini. Anggota dapat melihat riwayat pengeluaran dan kwitansi bantuan kapan saja.",
    },
    {
      q: "Apa yang terjadi saat anggota menekan tombol SOS darurat?",
      a: "Aplikasi memancarkan koordinat lokasi akurat Anda ke tim Satgas yang sedang bertugas piket, sehingga rekan terdekat dapat langsung meluncur ke lokasi kejadian.",
    },
  ];

  return (
    <section id="faq" className="border-b border-border/60 bg-background py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            Tanya Jawab Komunitas
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            Informasi penting seputar keanggotaan dan operasional Driver Riang Gembira.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={f.q}
                className="overflow-hidden rounded-xl border border-border/80 bg-card transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-foreground hover:bg-muted/40"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border/50 px-4 pb-4 pt-2 text-xs leading-relaxed text-muted-foreground">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

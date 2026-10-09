import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function LandingFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Siapa aja yang boleh gabung ke keluarga DRG?",
      a: "Rekan-rekan pengemudi transportasi online (ojol roda 2 maupun taksi online roda 4) yang aktif di jalan dan mau menjunjung tinggi nilai guyub, rukun, saling bantu satu sama lain.",
    },
    {
      q: "Gimana prosesnya kalo mau gabung?",
      a: "Singkat aja. Isi formulir, nanti tim kaderisasi kita bakal kontak singkat buat kenalan bareng di shelter terdekat. Tujuannya biar kita kenal satu sama lain, bukan sekadar data.",
    },
    {
      q: "Kas gotong royongnya beneran terbuka?",
      a: "Iya, beneran terbuka. Semua mutasi kas kita catat di buku besar digital, bisa dilihat sama semua anggota keluarga DRG. Kita pegang prinsip: nabung bareng, bantu bareng, jelas bareng.",
    },
    {
      q: "Kalo tekan tombol SOS, bakal gimana?",
      a: "Langsung kirim lokasi akurat ke Satgas yang lagi piket. Jadi rekan-rekan terdekat bisa langsung meluncur bantu saudara kita yang lagi kesusahan di aspal. Kita nggak biarin saudara sendirian.",
    },
    {
      q: "Harus bayar berapa buat gabung?",
      a: "Pendaftaran awalnya gratis. Adanya iuran gotong royong itu kita atur bareng lewat musyawarah keluarga, dan pemakaiannya selalu kita laporkan terbuka ke anggota.",
    },
  ];

  return (
    <section id="faq" className="border-b border-border/60 bg-background py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            Biar Makin Paham
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pertanyaan Biar Makin Paham Bareng
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base text-pretty leading-relaxed">
            Masih bingung? Tenang aja, kita jelasin santai kayak ngobrol bareng di basecamp.
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
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border/50 px-4 pb-4 pt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-border/80 bg-muted/30 p-5 text-center">
          <p className="text-sm font-medium text-foreground">
            Masih penasaran? Yuk kenalan bareng aja dulu
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Nggak ada paksaan, kita ngobrol santai aja
          </p>
          <div className="mt-3 flex justify-center">
            <Button asChild size="sm" className="rounded-lg">
              <Link to="/daftar">Yuk Gabung Sekarang</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

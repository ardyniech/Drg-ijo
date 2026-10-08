import { Siren, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function LandingSosSpotlight() {
  return (
    <section className="border-b border-rose-500/20 bg-gradient-to-r from-rose-500/10 via-background to-rose-500/5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-600 shadow-sm">
              <Siren className="h-3 w-3" />
              Siaga 24/7 · Kita Jaga Kita
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance leading-[1.12]">
              Satu Sentuhan, Saling Jaga Satu Sama Lain
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg max-w-xl text-pretty leading-relaxed">
              Kalo ada saudara kita kesusahan di aspal, tombol SOS langsung kirim lokasi GPS ke Satgas yang lagi piket. Soalnya kita bukan cuma rekan kerja, kita keluarga besar DRG.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-warm hover:bg-primary/90"
              >
                <Link to="/daftar">Yuk Gabung Biar Bisa Saling Jaga</Link>
              </Button>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-rose-600" />
                Prioritas utama: keselamatan saudara di jalan
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-card/90 p-6 shadow-lg shadow-rose-500/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-500/20 to-rose-500/5 text-rose-600 shadow-sm">
                  <Siren className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Tombol SOS Darurat</div>
                  <div className="text-xs text-muted-foreground">Langsung terhubung ke Satgas piket terdekat</div>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-border/80 bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                "Kalau ada rekan butuh bantuan, nggak usah ragu. Kita gas saling bantu, itu udah budaya kita bareng-bareng."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

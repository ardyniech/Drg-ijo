import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, HeartHandshake, CheckCircle } from "lucide-react";

interface LandingHeroProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export function LandingHero({ isLoggedIn, userName }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/30 to-background py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {isLoggedIn && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs text-primary">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
              Sesi aktif sebagai <strong>{userName || "Anggota"}</strong>
            </span>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 font-bold underline hover:opacity-80"
            >
              Langsung ke Dashboard <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-primary">
              <span>KOMUNITAS DRIVER RIANG GEMBIRA (DRG)</span>
              <span aria-hidden="true">·</span>
              <span>MALANG RAYA</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.12]">
              Guyub di Jalan, Solidaritas Nyata di Kehidupan.
            </h1>

            <p className="mt-5 text-base text-muted-foreground sm:text-lg max-w-xl text-pretty leading-relaxed">
              Wadah independen pengemudi online: keterbukaan kas gotong royong, koordinasi posko
              satgas siaga 24 jam, dan penjenjangan anggota dengan asas kehormatan.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-warm hover:bg-primary/90"
              >
                <Link to="/daftar">
                  <span>Daftar Jadi Anggota</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 gap-2 rounded-xl border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                <Link to="/auth">
                  <span>Masuk ke Akun</span>
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Verifikasi PIC Kaderisasi
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <HeartHandshake className="h-4 w-4 text-primary" />
                Dana Santunan Terbuka
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-xl">
              <img
                src="/src/assets/images/drg_hero_community_1791295114418.jpg"
                alt="Pertemuan hangat anggota Komunitas Driver Riang Gembira (DRG)"
                className="aspect-16/10 w-full object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-xs font-semibold">Basecamp Shelter Utama DRG</p>
                <p className="text-[11px] text-white/80">
                  Keluarga besar mitra roda dua & roda empat
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

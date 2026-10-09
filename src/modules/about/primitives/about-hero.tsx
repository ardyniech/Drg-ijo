import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Layers, WifiOff } from "lucide-react";

export function AboutHero() {
  return (
    <section className="border-b border-border/60 bg-gradient-to-b from-muted/30 to-background py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          Tentang & Transparansi Produk
        </div>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl text-balance">
          Kenali DRG App Apa Adanya
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base text-pretty">
          Halaman ini menjelaskan fitur apa saja yang sudah ada dan sejauh mana pengembangannya —
          tanpa dilebih-lebihkan. Tujuannya agar setiap dulur tahu persis apa yang bisa diandalkan
          hari ini.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-11 gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-warm hover:bg-primary/90"
          >
            <Link to="/daftar">
              <span>Yuk Gabung</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 gap-2 rounded-xl border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <Link to="/">
              <span>Kembali ke Beranda</span>
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Layers className="h-4 w-4 text-primary" />
            <span>Local-first: semua data tersimpan di perangkatmu</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <WifiOff className="h-4 w-4 text-primary" />
            <span>Bisa dipasang sebagai aplikasi & diakses offline</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Kata sandi disimpan dalam bentuk hash</span>
          </div>
        </div>
      </div>
    </section>
  );
}

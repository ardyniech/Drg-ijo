import { Link } from "@tanstack/react-router";

export function LandingFooter() {
  return (
    <footer className="bg-muted/30 py-12 text-xs text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-warm shadow-warm">
                <span className="font-display text-xs font-bold text-primary-foreground">D</span>
              </div>
              <span className="font-display text-base font-bold text-foreground">DRG App</span>
            </div>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Komunitas Driver Riang Gembira (DRG). Bergerak mandiri untuk solidaritas,
              perlindungan, dan kesejahteraan rekan di jalan.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 font-medium">
            <Link to="/daftar" className="hover:text-foreground">
              Pendaftaran Anggota
            </Link>
            <Link to="/auth" className="hover:text-foreground">
              Masuk ke Akun
            </Link>
            <a href="#pilar" className="hover:text-foreground">
              Pilar Gerakan
            </a>
            <a href="#transparansi" className="hover:text-foreground">
              Buku Kas
            </a>
            <a href="#faq" className="hover:text-foreground">
              Pusat Bantuan
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
          <div>Basecamp Utama: Jl. Soekarno-Hatta, Malang Raya, Jawa Timur</div>
          <div>© {new Date().getFullYear()} Komunitas DRG. Hak cipta dilindungi.</div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";

interface LandingHeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export function LandingHeader({ isLoggedIn, userName }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-warm shadow-warm">
            <span className="font-display text-base font-bold text-primary-foreground">D</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            DRG App
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-semibold text-muted-foreground md:flex">
          <a href="/#pilar" className="transition-colors hover:text-foreground">
            Pilar Seduluran
          </a>
          <a href="/#transparansi" className="transition-colors hover:text-foreground">
            Kas Gotong Royong
          </a>
          <a href="/#satgas" className="transition-colors hover:text-foreground">
            Satgas & SOS Jalur
          </a>
          <Link to="/about" className="transition-colors hover:text-foreground">
            Tentang & Status
          </Link>
          <a href="/#faq" className="transition-colors hover:text-foreground">
            Tanya Santui
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          {isLoggedIn ? (
            <Button
              asChild
              size="sm"
              className="h-9 gap-1.5 rounded-lg bg-primary font-medium text-primary-foreground shadow-warm hover:bg-primary/90"
            >
              <Link to="/dashboard">
                <span>Pangkalan ({userName?.split(" ")[0] || "Dulur"})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 gap-1.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Link to="/auth">
                  <LogIn className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Masuk Pangkalan</span>
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="h-9 gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-warm hover:bg-primary/90"
              >
                <Link to="/daftar">
                  <span>Merapat (Daftar)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

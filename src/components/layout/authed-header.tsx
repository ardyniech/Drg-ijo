import { Link } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { Siren, Radio, RadioTower } from "lucide-react";
import { toast } from "sonner";
import { SyncStatusBadge } from "@/core/sync";
import { PWAInstallButton } from "./pwa-install-button";

interface AuthedHeaderProps {
  onBit: boolean;
  setOnBit: (val: boolean) => void;
  hydrated: boolean;
  today: string;
}

export function AuthedHeader({ onBit, setOnBit, hydrated, today }: AuthedHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/85 px-3 backdrop-blur md:px-6">
      <SidebarTrigger className="text-foreground" />
      <SyncStatusBadge />
      <div className="ml-auto flex items-center gap-2">
        <span
          className="hidden lg:inline text-xs capitalize text-muted-foreground"
          suppressHydrationWarning
        >
          {today}
        </span>
        <PWAInstallButton />
        <button
          type="button"
          onClick={() => {
            const next = !onBit;
            setOnBit(next);
            toast[next ? "success" : "message"](
              next ? "On-Bit aktif — lokasi live dibagikan" : "On-Bit dimatikan — lokasi berhenti",
            );
          }}
          title={
            hydrated
              ? onBit
                ? "Ngebit — lokasi live aktif. Klik untuk berhenti."
                : "Off-Bit — klik untuk mulai share lokasi."
              : "Memuat GPS…"
          }
          className={
            "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition " +
            (onBit
              ? "border-success/40 bg-success/10 text-success"
              : "border-border bg-muted text-muted-foreground")
          }
        >
          {onBit ? <RadioTower className="h-3 w-3 animate-pulse" /> : <Radio className="h-3 w-3" />}
          {onBit ? "On-Bit" : "Off-Bit"}
        </button>
        <Button
          asChild
          size="sm"
          className="bg-signal text-signal-foreground shadow-warm hover:bg-signal/90"
        >
          <Link to="/kejadian">
            <Siren className="mr-1.5 h-4 w-4" /> SOS
          </Link>
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}

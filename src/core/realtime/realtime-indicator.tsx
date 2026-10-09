import { Radio, WifiOff } from "lucide-react";
import { useRealtimeBroadcast } from "./use-realtime-broadcast";

export function RealtimeIndicator() {
  const { channelState } = useRealtimeBroadcast();
  const { isConnected, isConnecting, lastEventAt } = channelState;

  if (isConnecting) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary">
        <Radio className="h-3 w-3 animate-pulse" />
        <span>Menyambung Jalur...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        <WifiOff className="h-3 w-3 text-muted-foreground" />
        <span>Jalur Lokal</span>
      </div>
    );
  }

  return (
    <div
      title={lastEventAt ? `Pembaruan realtime terakhir: ${lastEventAt}` : "Tersambung ke kanal satgas"}
      className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>Kanal Live Aktif</span>
    </div>
  );
}

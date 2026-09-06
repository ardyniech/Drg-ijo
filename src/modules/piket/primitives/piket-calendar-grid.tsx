import { Loader2 } from "lucide-react";
import { Shift, slots, toIso } from "../types";
import { SwapButton } from "./swap-button";

interface Props {
  days: Date[];
  shifts: Shift[];
  isLoading: boolean;
  profileMap: Record<string, string>;
  currentUserId?: string;
}

export function PiketCalendarGrid({
  days,
  shifts,
  isLoading,
  profileMap,
  currentUserId,
}: Props) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider">
        <div className="p-3 text-muted-foreground">Slot</div>
        {days.map((d) => (
          <div key={d.toISOString()} className="p-3 text-center">
            <div>{d.toLocaleDateString("id-ID", { weekday: "short" })}</div>
            <div className="text-muted-foreground">{d.getDate()}</div>
          </div>
        ))}
      </div>
      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
        </div>
      ) : (
        slots.map((slot) => (
          <div key={slot} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border/60 last:border-0">
            <div className="p-3 text-xs font-semibold capitalize text-muted-foreground">{slot}</div>
            {days.map((d) => {
              const iso = toIso(d);
              const s = shifts.find((x) => x.tanggal === iso && x.slot === slot);
              return (
                <div key={iso + slot} className="min-h-[64px] border-l border-border/60 p-2 text-xs">
                  {s ? (
                    <div className="rounded-lg bg-primary/10 p-2">
                      <div className="font-semibold text-primary">
                        {s.user_id ? profileMap[s.user_id] ?? "…" : "Kosong"}
                      </div>
                      {s.wilayah && <div className="text-muted-foreground">{s.wilayah}</div>}
                      {s.user_id === currentUserId && currentUserId && (
                        <SwapButton shiftId={s.id} currentUserId={currentUserId} />
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground/60">—</span>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

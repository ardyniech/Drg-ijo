import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import {
  addDays,
  startOfWeek,
  usePiket,
  NewShiftDialog,
  PiketCalendarGrid,
  PiketSwapList,
} from "@/modules/piket";

export const Route = createFileRoute("/_authenticated/piket")({
  head: () => ({ meta: [{ title: "Jaga Satu Aspal — DRG App" }] }),
  component: PiketPage,
});

function PiketPage() {
  const { user } = Route.useRouteContext();
  const canManage = Boolean(user?.id);

  const {
    weekStart,
    setWeekStart,
    days,
    fromIso,
    shifts,
    isLoading,
    profileMap,
    mySwaps,
    respondSwap,
    refetch,
  } = usePiket(user?.id);

  return (
    <PageShell
      eyebrow="Jaga Satu Aspal"
      title="Jadwal Jaga Sedulur di Jalan"
      description="Semua sedulur gantian jaga satu aspal: pantau rekan narik dari mana pun orderan bawa. Atur slot jaga, tukar shift santui, dan absen siaga di posisimu."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-muted/80 p-1 text-xs border border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              className="h-7 px-2.5 text-xs font-semibold rounded-lg"
            >
              <span className="hidden sm:inline">← Minggu Lalu</span>
              <span className="sm:hidden">← Lalu</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWeekStart(startOfWeek(new Date()))}
              className="h-7 px-2.5 text-xs font-semibold rounded-lg bg-background shadow-xs text-foreground"
            >
              Hari Ini
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              className="h-7 px-2.5 text-xs font-semibold rounded-lg"
            >
              <span className="hidden sm:inline">Minggu Depan →</span>
              <span className="sm:hidden">Depan →</span>
            </Button>
          </div>
          {canManage && <NewShiftDialog defaultDate={fromIso} onDone={refetch} />}
        </div>
      }
    >
      <PiketCalendarGrid
        days={days}
        shifts={shifts}
        isLoading={isLoading}
        profileMap={profileMap}
        currentUserId={user?.id}
      />

      <PiketSwapList
        swaps={mySwaps}
        currentUserId={user?.id}
        onRespond={(payload) => respondSwap.mutate(payload)}
      />
    </PageShell>
  );
}

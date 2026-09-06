import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { useIs } from "@/hooks/use-my-role";
import {
  addDays,
  startOfWeek,
  usePiket,
  NewShiftDialog,
  PiketCalendarGrid,
  PiketSwapList,
} from "@/modules/piket";

export const Route = createFileRoute("/_authenticated/piket")({
  head: () => ({ meta: [{ title: "Piket Satgas — DRG App" }] }),
  component: PiketPage,
});

function PiketPage() {
  const { user } = Route.useRouteContext();
  const canManage = useIs("satgas") || useIs("admin");

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
      eyebrow="Satgas"
      title="Jadwal Piket"
      description="Kelola shift mingguan, ajukan tukar shift, dan pantau permintaan."
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeekStart(addDays(weekStart, -7))}>
            ← Minggu lalu
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>
            Hari ini
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWeekStart(addDays(weekStart, 7))}>
            Minggu depan →
          </Button>
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

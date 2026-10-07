import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/hooks/use-me";
import {
  useDashboardOverview,
  DashboardHero,
  DashboardStats,
  DashboardPiketGrid,
  DashboardRoleSwitcher,
  DashboardRoleWidgetRenderer,
} from "@/modules/dashboard";
import { useDashboardGreeting } from "@/modules/dashboard/primitives/dashboard-header-greeting";
import { ActivityLogView } from "@/modules/activity-log";
import { useCommunityProgress, ProgressiveOnboardingCard } from "@/modules/onboarding";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard Operasional & Peran — DRG App" },
      {
        name: "description",
        content:
          "Dashboard spesifik peran DRG: Ketua Umum, Sekretaris, Bendahara, Admin, Korlap, Satgas, Dewan Etik, dan Driver.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const { data: overview, isError, refetch } = useDashboardOverview();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("nama, role, pangkalan")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: screeningApps = [] } = useQuery({
    queryKey: ["screening-apps"],
    queryFn: async () => {
      const { data } = await supabase.from("screening_applications").select("id, email");
      return data ?? [];
    },
  });

  const myApp = screeningApps.find((c) => c.email?.toLowerCase() === user?.email?.toLowerCase());
  const hasSubmittedScreening = Boolean(myApp);

  const [activeRole, setActiveRole] = useState<UserRole>("driver");

  useEffect(() => {
    if (profile?.role) {
      const r = profile.role === "member" ? "driver" : (profile.role as UserRole);
      setActiveRole(r);
    }
  }, [profile?.role]);

  const progress = useCommunityProgress({
    hasSubmittedScreening,
    hasCompletedProfile: Boolean(profile?.pangkalan && profile?.nama),
    hasShifts: Boolean((overview?.shiftHariIni ?? 0) > 0),
    hasTransactions: Boolean((overview?.saldo ?? 0) > 0 || (overview?.masukBulanIni ?? 0) > 0),
    role: activeRole,
  });

  const displayName = profile?.nama?.split(" ")[0] || user?.user_metadata?.nama || "Rekan Driver";
  const greetingTitle = useDashboardGreeting(displayName);

  return (
    <PageShell
      eyebrow="Dashboard terpadu komunitas"
      title={greetingTitle}
      description="Ringkasan operasional & dashboard khusus sesuai jabatan kepengurusan organisasi DRG."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/roles">Pengurus & SK</Link>
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link to="/kas">Catat Transaksi</Link>
          </Button>
        </div>
      }
    >
      <DashboardRoleSwitcher activeRole={activeRole} onRoleChange={setActiveRole} />

      <DashboardRoleWidgetRenderer role={activeRole} />

      <ProgressiveOnboardingCard
        level={progress.currentLevel}
        progressPercent={progress.progressPercent}
        nextMission={progress.nextMission}
        roleTitle={progress.roleTitle}
      />

      <DashboardHero overview={overview} />

      {isError && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-signal">
          <span>Gagal memuat ringkasan data operasional.</span>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Coba lagi
          </Button>
        </div>
      )}

      <DashboardStats overview={overview} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardPiketGrid piket={overview?.piket ?? []} />
        <ActivityLogView roleFilter={activeRole === "driver" ? "all" : activeRole} limit={6} />
      </div>
    </PageShell>
  );
}

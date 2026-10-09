import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthedHeader } from "@/components/layout/authed-header";
import { EmergencySosBanner } from "@/modules/kejadian";
import { OfflineIndicator } from "@/components/layout/offline-indicator";
import { useLiveLocation } from "@/hooks/use-live-location";
import { useMe } from "@/hooks/use-me";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ preload }) => {
    if (preload || typeof window === "undefined") return { user: null };
    const session = LocalAuthClient.getSession();
    if (session?.user) return { user: session.user };
    const { data } = await supabase.auth.getUser();
    if (!data?.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const context = Route.useRouteContext();
  const activeUser =
    (typeof window !== "undefined" ? LocalAuthClient.getSession()?.user : null) ?? context?.user;
  const { onBit, setOnBit, error, hydrated } = useLiveLocation(activeUser?.id);
  const { data: me } = useMe();

  useEffect(() => {
    setMounted(true);
    const session = LocalAuthClient.getSession();
    if (!session?.user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [navigate]);

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-xs text-muted-foreground animate-pulse">
            Menghubungkan ke pangkalan DRG...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AuthedHeader onBit={onBit} setOnBit={setOnBit} hydrated={hydrated} today={today} />
          <EmergencySosBanner />
          {me?.isPendingReview && (
            <div className="border-b border-warn/40 bg-warn/15 px-3 py-2 text-center text-xs text-amber-800 dark:text-amber-100 md:px-6">
              Akun dulur <b>menunggu verifikasi pangkalan</b>. Sabar ya dulur, modul organisasi
              terbuka setelah disahkan PIC pangkalan.
            </div>
          )}
          {onBit && error && (
            <div className="border-b border-warn/40 bg-warn/15 px-3 py-1.5 text-center text-[11px] text-amber-800 dark:text-amber-100 md:px-6">
              GPS jalur belum terbaca: {error}. Silakan aktifkan izin lokasi di browser.
            </div>
          )}
          <main className="flex-1">
            <Outlet />
          </main>
          <OfflineIndicator />
        </div>
      </div>
    </SidebarProvider>
  );
}

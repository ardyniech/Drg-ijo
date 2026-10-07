import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { runStorageMigrationGuard } from "@/core/sync";
import { Toaster } from "@/components/ui/sonner";
import { RootNotFoundComponent, RootErrorComponent } from "@/components/layout/root-error-boundary";
import { getRootHead } from "@/components/layout/root-head-config";

const fallbackQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: getRootHead,
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: RootNotFoundComponent,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthSync({ client }: { client: QueryClient }) {
  const router = useRouter();
  useEffect(() => {
    const unsubLocal = LocalAuthClient.onAuthStateChange(() => {
      router.invalidate();
      client.invalidateQueries();
    });
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") client.invalidateQueries();
    });
    return () => {
      unsubLocal();
      data.subscription.unsubscribe();
    };
  }, [router, client]);
  return null;
}

function RootComponent() {
  const context = Route.useRouteContext();
  const [activeClient] = useState(() => context?.queryClient ?? fallbackQueryClient);
  const clientToUse = context?.queryClient ?? activeClient;

  useEffect(() => {
    runStorageMigrationGuard();
    if (
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      const isDev =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes("ais-dev-");

      if (isDev) {
        // Unregister service workers in development to prevent caching of dynamic modules
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister().then(() => {
              console.log("[Dev] Service Worker unregistered to prevent Vite import caching.");
            });
          }
        });

        // Purge caches in development
        if ("caches" in window) {
          window.caches.keys().then((keys) => {
            keys.forEach((key) => {
              window.caches.delete(key);
            });
          });
        }
      } else {
        // Only register service worker in production
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }
    }
  }, []);

  return (
    <QueryClientProvider client={clientToUse}>
      <AuthSync client={clientToUse} />
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

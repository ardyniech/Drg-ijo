import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import {
  LandingHeader,
  LandingHero,
  LandingFeatures,
  LandingStats,
  LandingFaq,
  LandingFooter,
} from "@/modules/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DRG App — Komunitas Driver Riang Gembira" },
      {
        name: "description",
        content:
          "Platform mandiri Komunitas DRG: kas gotong royong transparan, satgas siaga SOS 24 jam, jadwal piket pangkalan, dan kaderisasi.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [userState, setUserState] = useState<{
    isLoggedIn: boolean;
    name: string;
  }>({
    isLoggedIn: false,
    name: "",
  });

  useEffect(() => {
    const session = LocalAuthClient.getSession();
    if (session?.user) {
      const nama =
        session.user.user_metadata?.nama || session.user.email?.split("@")[0] || "Anggota";
      setUserState({
        isLoggedIn: true,
        name: nama,
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <LandingHeader isLoggedIn={userState.isLoggedIn} userName={userState.name} />
      <main className="flex-1">
        <LandingHero isLoggedIn={userState.isLoggedIn} userName={userState.name} />
        <LandingFeatures />
        <LandingStats />
        <LandingFaq />
      </main>
      <LandingFooter />
    </div>
  );
}

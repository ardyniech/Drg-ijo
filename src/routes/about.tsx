import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { LandingHeader, LandingFooter } from "@/modules/landing";
import {
  AboutHero,
  FeatureTreeView,
  AboutHonestyNote,
  AboutRoadmap,
  AboutDevelopmentLog,
} from "@/modules/about";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Tentang & Status Fitur — DRG App" },
      {
        name: "description",
        content:
          "Informasi lengkap dan jujur tentang fitur yang sudah tersedia di DRG App serta sejauh mana pengembangannya.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [userState, setUserState] = useState({ isLoggedIn: false, name: "" });

  useEffect(() => {
    const session = LocalAuthClient.getSession();
    if (session?.user) {
      const nama =
        session.user.user_metadata?.nama || session.user.email?.split("@")[0] || "Anggota";
      setUserState({ isLoggedIn: true, name: nama });
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <LandingHeader isLoggedIn={userState.isLoggedIn} userName={userState.name} />
      <main className="flex-1">
        <AboutHero />
        <FeatureTreeView />
        <AboutRoadmap />
        <AboutDevelopmentLog />
        <AboutHonestyNote />
      </main>
      <LandingFooter />
    </div>
  );
}

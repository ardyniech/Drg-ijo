import { useState, useEffect } from "react";

interface Props {
  displayName: string;
}

export function useDashboardGreeting(displayName: string) {
  const [salam, setSalam] = useState("Selamat datang");

  useEffect(() => {
    const hour = new Date().getHours();
    const currentSalam =
      hour < 11
        ? "Selamat pagi"
        : hour < 15
          ? "Selamat siang"
          : hour < 18
            ? "Selamat sore"
            : "Selamat malam";
    setSalam(currentSalam);
  }, []);

  return `${salam}, ${displayName}`;
}

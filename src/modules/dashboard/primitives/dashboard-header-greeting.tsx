import { useState, useEffect } from "react";

interface Props {
  displayName: string;
}

export function useDashboardGreeting(displayName: string) {
  const [salam, setSalam] = useState("Salam satu aspal");

  useEffect(() => {
    const hour = new Date().getHours();
    const currentSalam =
      hour < 11
        ? "Salam satu aspal & selamat pagi"
        : hour < 15
          ? "Gas tipis-tipis & selamat siang"
          : hour < 18
            ? "Salam santui & selamat sore"
            : "Kopi darat santui & selamat malam";
    setSalam(currentSalam);
  }, []);

  return `${salam}, Dulur ${displayName}! 🏍️`;
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SEED_DRIVERS, SEED_SHELTERS } from "../storage/peta-storage";
import { ActiveDriverMarker, OfficialShelter } from "../types";

export function usePetaRadar() {
  const [maxRadius, setMaxRadius] = useState<number>(5);
  const [selectedPangkalan, setSelectedPangkalan] = useState<string>("all");

  const driversQuery = useQuery({
    queryKey: ["peta", "drivers"],
    queryFn: async (): Promise<ActiveDriverMarker[]> => {
      return SEED_DRIVERS;
    },
    refetchInterval: 10000,
  });

  const sheltersQuery = useQuery({
    queryKey: ["peta", "shelters"],
    queryFn: async (): Promise<OfficialShelter[]> => {
      return SEED_SHELTERS;
    },
  });

  const allDrivers = driversQuery.data ?? [];
  const filteredDrivers = allDrivers.filter((d) => {
    const matchesRadius = d.distance_km <= maxRadius;
    const matchesPangkalan = selectedPangkalan === "all" || d.pangkalan === selectedPangkalan;
    return matchesRadius && matchesPangkalan;
  });

  return {
    drivers: filteredDrivers,
    allDriversCount: allDrivers.length,
    shelters: sheltersQuery.data ?? [],
    maxRadius,
    setMaxRadius,
    selectedPangkalan,
    setSelectedPangkalan,
    isLoading: driversQuery.isLoading || sheltersQuery.isLoading,
  };
}

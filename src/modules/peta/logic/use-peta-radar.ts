import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getActiveDrivers, getShelters } from "../storage/peta-storage";
import { ActiveDriverMarker, OfficialShelter } from "../types";

export function usePetaRadar() {
  const [maxRadius, setMaxRadius] = useState<number>(5);
  const [selectedPangkalan, setSelectedPangkalan] = useState<string>("all");

  const driversQuery = useQuery({
    queryKey: ["peta", "drivers"],
    queryFn: async (): Promise<ActiveDriverMarker[]> => {
      return getActiveDrivers();
    },
    refetchInterval: 10000,
  });

  const sheltersQuery = useQuery({
    queryKey: ["peta", "shelters"],
    queryFn: async (): Promise<OfficialShelter[]> => {
      return getShelters();
    },
  });

  const pangkalanQuery = useQuery({
    queryKey: ["peta", "pangkalan"],
    queryFn: async (): Promise<string[]> => {
      const { data } = await supabase.from("profiles").select("pangkalan");
      const rows = (data ?? []) as Array<{ pangkalan?: string | null }>;
      return [...new Set(rows.map((p) => p.pangkalan).filter((p): p is string => Boolean(p)))];
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
    pangkalanOptions: pangkalanQuery.data ?? [],
    maxRadius,
    setMaxRadius,
    selectedPangkalan,
    setSelectedPangkalan,
    isLoading: driversQuery.isLoading || sheltersQuery.isLoading,
  };
}

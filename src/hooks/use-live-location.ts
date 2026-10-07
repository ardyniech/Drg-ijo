import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type GpsPermissionState = "prompt" | "granted" | "denied" | "unsupported";

export function useLiveLocation(userId?: string) {
  const [onBit, setOnBitState] = useState<boolean>(false);
  const [permission, setPermission] = useState<GpsPermissionState>("prompt");
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (typeof window !== "undefined") {
      if (localStorage.getItem("drg_on_bit") === "true") {
        setOnBitState(true);
      }
      if (!("geolocation" in navigator)) {
        setPermission("unsupported");
      }
    }
  }, []);

  const requestGps = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setPermission("unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setPermission("granted");
        setError(null);
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });

        if (userId) {
          try {
            await supabase.from("live_locations").upsert({
              user_id: userId,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              on_bit: true,
              updated_at: new Date().toISOString(),
            });
          } catch (e) {
            console.error("Failed to upsert live location", e);
          }
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermission("denied");
        }
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [userId]);

  const setOnBit = (val: boolean) => {
    setOnBitState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("drg_on_bit", val ? "true" : "false");
    }
    if (val) {
      requestGps();
    }
  };

  return {
    onBit,
    setOnBit,
    permission,
    coords,
    error,
    retry: requestGps,
    hydrated,
  };
}

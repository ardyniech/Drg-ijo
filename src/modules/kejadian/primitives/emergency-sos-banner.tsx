import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Siren, Volume2, VolumeX, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKejadian } from "../logic/use-kejadian";
import { playEmergencyChime, getEmergencyMuted, setEmergencyMuted } from "../logic/emergency-sound";

export function EmergencySosBanner() {
  const { incidents } = useKejadian();
  const [muted, setMutedState] = useState(getEmergencyMuted);

  const activeEmergency = incidents.find((inc) => inc.status === "aktif");

  useEffect(() => {
    if (activeEmergency && !muted) {
      playEmergencyChime();
    }
  }, [activeEmergency, muted]);

  if (!activeEmergency) return null;

  const toggleMute = () => {
    const next = !muted;
    setEmergencyMuted(next);
    setMutedState(next);
  };

  return (
    <div className="relative border-b-2 border-rose-600 bg-rose-600 px-3 py-2.5 text-white shadow-md md:px-6">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 animate-pulse">
            <Siren className="h-5 w-5 text-white" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                SOS DARURAT AKTIF
              </span>
              <span className="text-xs font-semibold uppercase">{activeEmergency.kategori}</span>
            </div>
            <p className="text-xs text-rose-100">
              <strong>{activeEmergency.driver_name}</strong> butuh bantuan di{" "}
              <span className="underline">{activeEmergency.lokasi_teks}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeEmergency.driver_phone && (
            <a
              href={`tel:${activeEmergency.driver_phone}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 text-xs font-medium text-white hover:bg-white/20"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Hubungi</span>
            </a>
          )}
          <button
            type="button"
            onClick={toggleMute}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
            title={muted ? "Nyalakan suara alarm" : "Matikan suara alarm"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <Button
            asChild
            size="sm"
            className="h-8 bg-white text-xs font-bold text-rose-700 hover:bg-rose-50 shadow-sm"
          >
            <Link to="/kejadian">
              Buka Insiden
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

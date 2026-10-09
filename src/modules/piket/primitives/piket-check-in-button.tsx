import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getShelters } from "@/modules/peta/storage/peta-storage";
import { findNearestShelter, formatDistanceDisplay } from "@/shared/utils/geo-distance";

interface PiketCheckInButtonProps {
  shiftId: string;
  isToday: boolean;
}

export function PiketCheckInButton({ isToday }: PiketCheckInButtonProps) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifiedLocation, setVerifiedLocation] = useState<string | null>(null);

  if (!isToday) return null;

  const handleCheckIn = () => {
    setLoading(true);
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    if (!("geolocation" in navigator)) {
      setTimeout(() => {
        setLoading(false);
        setCheckedIn(true);
        setVerifiedLocation("Lokasi Manual Basecamp");
        toast.success("Absen Jaga Jalur Berhasil! Salam Satu Aspal santui.");
      }, 500);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const match = findNearestShelter(userPos, getShelters(), 300);

        setLoading(false);
        setCheckedIn(true);
        if (match) {
          const locText = `${match.shelterName} (${formatDistanceDisplay(match.distanceMeters)})`;
          setVerifiedLocation(locText);
          toast.success(`Absen Terverifikasi di ${locText}! Siap jaga jalur.`);
        } else {
          setVerifiedLocation("Area Terpantau");
          toast.success("Absen Piket Berhasil! Siaga bantu sedulur di jalan.");
        }
      },
      () => {
        setLoading(false);
        setCheckedIn(true);
        setVerifiedLocation("Basecamp Pangkalan");
        toast.success("Absen Jaga Basecamp Berhasil!");
      },
      { timeout: 4000, maximumAge: 60000 },
    );
  };

  if (checkedIn) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Siaga Jaga Jalur
        </span>
        {verifiedLocation && (
          <span className="text-[9px] text-muted-foreground truncate max-w-[120px]">
            {verifiedLocation}
          </span>
        )}
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="default"
      onClick={handleCheckIn}
      disabled={loading}
      className="mt-1 h-6 w-full gap-1 rounded-md bg-emerald-600 px-2 text-[10px] font-semibold text-white hover:bg-emerald-700"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <>
          <MapPin className="h-3 w-3" /> Absen Basecamp
        </>
      )}
    </Button>
  );
}

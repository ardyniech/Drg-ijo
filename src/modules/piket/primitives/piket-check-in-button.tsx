import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PiketCheckInButtonProps {
  shiftId: string;
  isToday: boolean;
}

export function PiketCheckInButton({ isToday }: PiketCheckInButtonProps) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordedLocation, setRecordedLocation] = useState<string | null>(null);

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
        setRecordedLocation("Lokasi Manual");
        toast.success("Absen Siaga Berhasil! Salam Satu Aspal santui.");
      }, 500);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        setLoading(false);
        setCheckedIn(true);
        setRecordedLocation(coords);
        toast.success("Absen Siaga Berhasil! Siap jaga sedulur di jalan.");
      },
      () => {
        setLoading(false);
        setCheckedIn(true);
        setRecordedLocation("Lokasi Manual");
        toast.success("Absen Siaga Berhasil, tetap jaga sedulur di jalurmu!");
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
        {recordedLocation && (
          <span className="text-[9px] text-muted-foreground truncate max-w-[120px]">
            {recordedLocation}
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
          <MapPin className="h-3 w-3" /> Absen Siaga
        </>
      )}
    </Button>
  );
}

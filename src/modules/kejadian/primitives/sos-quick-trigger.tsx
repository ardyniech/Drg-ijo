import { useState, useEffect } from "react";
import { Siren, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useKejadian } from "../logic/use-kejadian";
import { useMe } from "@/hooks/use-me";
import { useLiveLocation } from "@/hooks/use-live-location";

export function SosQuickTrigger() {
  const { data: me } = useMe();
  const { coords } = useLiveLocation(me?.id);
  const { createIncident } = useKejadian();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      if (me) {
        createIncident.mutate({
          driver_id: me.id,
          driver_name: me.nama,
          driver_phone: "081234567890",
          kategori: "begal_kriminal",
          tingkat: "darurat_tinggi",
          deskripsi:
            "PANGGILAN DARURAT SATU ASPAL! Dulur butuh bantuan gercep satgas terdekat sekarang juga.",
          lat: coords?.lat,
          lng: coords?.lng,
        });
      }
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [countdown, me, coords, createIncident]);

  const handleStartSos = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    setCountdown(3);
  };

  const handleCancelSos = () => {
    setCountdown(null);
  };

  return (
    <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        {countdown === null ? (
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={handleStartSos}
              className="group relative flex h-28 w-28 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 animate-pulse"
              title="Tekan untuk kirim sinyal darurat ke seluruh dulur satgas"
            >
              <Siren className="h-14 w-14" />
              <span className="sr-only">Kirim SOS</span>
            </button>
            <div className="space-y-1">
              <h3 className="font-bold text-destructive text-lg">TOMBOL DARURAT DULUR JALUR</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Tekan tombol untuk membunyikan alarm satgas & memancarkan koordinat GPS darurat ke
                dulur se-pangkalan.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-4xl font-black animate-bounce">
              {countdown}
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-destructive text-sm flex items-center justify-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Memanggil Bantuan Dulur Satgas ({countdown}{" "}
                dtk)...
              </h4>
              <p className="text-xs text-muted-foreground">
                Klik batal jika tombol tidak sengaja tertekan, santui dulur.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelSos}
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <XCircle className="mr-1.5 h-4 w-4" /> Batalkan Panggilan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

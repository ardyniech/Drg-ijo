import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, RefreshCw, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useLiveLocation } from "@/hooks/use-live-location";

export function GpsCard({ userId }: { userId?: string }) {
  const { permission, error, retry, onBit, setOnBit, coords } = useLiveLocation(userId);
  const denied = permission === "denied";
  const unsupported = permission === "unsupported";
  const granted = permission === "granted";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4" /> Izin GPS (On-Bit)
          {granted && !error && <Badge className="ml-auto bg-success/15 text-success">Aktif</Badge>}
        </CardTitle>
        <CardDescription>
          Aturan komunitas: share lokasi live wajib aktif saat ngebit agar Satgas bisa merespons
          SOS.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {unsupported ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <div className="flex items-center gap-2 font-medium text-destructive">
              <ShieldAlert className="h-4 w-4" /> Tidak didukung
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Browser/perangkat ini tidak punya API GPS. Buka via browser mobile standar atau Add to
              Home Screen.
            </p>
          </div>
        ) : denied ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <div className="flex items-center gap-2 font-medium text-destructive">
              <ShieldAlert className="h-4 w-4" /> Izin ditolak
            </div>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
              <li>Ketuk ikon gembok/info di sebelah URL browser.</li>
              <li>
                Pilih <b>Site settings</b> → <b>Location</b> → <b>Allow</b>.
              </li>
              <li>
                Refresh halaman, lalu klik <b>Coba lagi</b> di bawah.
              </li>
            </ol>
          </div>
        ) : (
          <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
            <li>
              Klik <b>Aktifkan GPS</b> — browser akan meminta izin lokasi.
            </li>
            <li>
              Pilih <b>Allow / Izinkan</b> pada popup browser.
            </li>
            <li>
              Pastikan status berubah jadi <b>On-Bit</b> hijau.
            </li>
          </ol>
        )}
        {error && !denied && (
          <div className="rounded-md bg-warn/15 px-2 py-1.5 text-xs text-warn-foreground">
            {error}
          </div>
        )}
        {coords && (
          <div className="flex items-center gap-2 text-xs text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> Terhubung — akurasi ±
            {Math.round(coords.accuracy ?? 0)} m
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {!onBit && !unsupported && (
            <Button
              size="sm"
              onClick={() => setOnBit(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Aktifkan GPS
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={retry} disabled={unsupported}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Coba lagi
          </Button>
          {onBit && (
            <Button size="sm" variant="ghost" onClick={() => setOnBit(false)}>
              Off-Bit sementara
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

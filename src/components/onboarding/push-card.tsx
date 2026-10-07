import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, RefreshCw, ShieldAlert, Loader2 } from "lucide-react";
import { usePush } from "@/hooks/use-push";

export function PushOnboardingCard({ userId }: { userId?: string }) {
  const { state, subscribed, busy, subscribe, unsubscribe } = usePush(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4" /> Notifikasi Push
          {subscribed && <Badge className="ml-auto bg-success/15 text-success">Aktif</Badge>}
        </CardTitle>
        <CardDescription>
          Terima alert SOS langsung dari rekan satgas seketika, meski browser sedang diminimize.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {state === "unsupported" ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <div className="flex items-center gap-2 font-medium text-destructive">
              <ShieldAlert className="h-4 w-4" /> Tidak didukung
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Push notification tidak didukung browser ini. Untuk iOS, pilih{" "}
              <b>Add to Home Screen</b> terlebih dahulu.
            </p>
          </div>
        ) : state === "denied" ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <div className="flex items-center gap-2 font-medium text-destructive">
              <ShieldAlert className="h-4 w-4" /> Izin diblokir
            </div>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
              <li>Ketuk ikon gembok di samping URL.</li>
              <li>
                Pilih <b>Notifications</b> → <b>Allow</b>.
              </li>
              <li>Refresh halaman, lalu klik tombol coba lagi.</li>
            </ol>
          </div>
        ) : (
          <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
            <li>
              Klik <b>Aktifkan Push</b> di bawah.
            </li>
            <li>
              Pilih <b>Allow / Izinkan</b> saat notifikasi dialog muncul.
            </li>
            <li>Status akan otomatis berubah menjadi aktif.</li>
          </ol>
        )}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => (subscribed ? unsubscribe() : subscribe())}
            disabled={busy || state === "unsupported"}
            variant={subscribed ? "outline" : "default"}
            className={subscribed ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"}
          >
            {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {subscribed ? "Matikan" : "Aktifkan Push"}
          </Button>
          {(state === "denied" || state === "unsupported") && (
            <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Coba lagi
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

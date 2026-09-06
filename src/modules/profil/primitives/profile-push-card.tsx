import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Loader2 } from "lucide-react";
import { usePush } from "@/hooks/use-push";

export function ProfilePushCard() {
  const { state, subscribed, busy, subscribe, unsubscribe } = usePush();

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4" /> Notifikasi Push
        </CardTitle>
        <CardDescription>
          Terima alert SOS langsung di perangkat, meski aplikasi ditutup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {state === "unsupported" ? (
          <p className="text-sm text-muted-foreground">
            Perangkat/browser ini belum mendukung Push. Coba install aplikasi (Add to Home Screen) atau pakai Chrome.
          </p>
        ) : state === "denied" ? (
          <p className="text-sm text-destructive">
            Izin notifikasi diblokir. Buka setelan browser → izinkan Notifikasi untuk situs ini.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3 text-sm">
              <div>
                <div className="font-medium">Status</div>
                <div className="text-xs text-muted-foreground">
                  {subscribed ? "Aktif di perangkat ini" : "Belum aktif"}
                </div>
              </div>
              <Badge variant={subscribed ? "default" : "outline"}>
                {subscribed ? "ON" : "OFF"}
              </Badge>
            </div>
            <Button
              variant={subscribed ? "outline" : "default"}
              className={subscribed ? "w-full" : "w-full bg-primary text-primary-foreground hover:bg-primary/90"}
              onClick={() => (subscribed ? unsubscribe() : subscribe())}
              disabled={busy}
            >
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {subscribed ? "Matikan di perangkat ini" : "Aktifkan Push"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

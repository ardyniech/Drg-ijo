import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { BellRing } from "lucide-react";
import { NOTIF_CONFIGS, ProfileRow } from "../types";

interface Props {
  form: Partial<ProfileRow>;
  onToggle: (key: keyof ProfileRow, value: boolean) => void;
}

export function ProfileNotificationsCard({ form, onToggle }: Props) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BellRing className="h-4 w-4" /> Preferensi Notifikasi
        </CardTitle>
        <CardDescription>Atur peristiwa apa saja yang kamu terima di aplikasi.</CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border/60">
        {NOTIF_CONFIGS.map((row) => (
          <div key={row.key} className="flex items-center justify-between py-3">
            <div className="pr-4">
              <div className="text-sm font-medium">{row.label}</div>
              <div className="text-xs text-muted-foreground">{row.desc}</div>
            </div>
            <Switch
              checked={Boolean(form[row.key])}
              onCheckedChange={(v) => onToggle(row.key, v)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

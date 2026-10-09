import { ActivityLogEntry } from "@/modules/activity-log/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, History, UserCheck, HeartHandshake, Clock } from "lucide-react";

export function OrgAuditLogView({ logs }: { logs: ActivityLogEntry[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center bg-card">
        <History className="mx-auto h-8 w-8 text-muted-foreground opacity-50 mb-2" />
        <h4 className="font-semibold text-xs text-foreground">Belum Ada Catatan Transparansi</h4>
        <p className="text-[11px] text-muted-foreground mt-1">
          Setiap perubahan status anggota atau pencairan dana SK Kas akan tercatat otomatis di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-1">
        <span>Catatan Audit & Pelacakan Transparansi Komunitas</span>
        <span>{logs.length} Log Tercatat</span>
      </div>

      <div className="grid gap-2">
        {logs.map((log) => {
          const isKas = log.module === "kas";
          const isMember = log.module === "anggota";
          const Icon = isKas ? HeartHandshake : isMember ? UserCheck : ShieldCheck;

          return (
            <Card
              key={log.id}
              className="border-border/70 shadow-xs hover:border-primary/40 transition-colors"
            >
              <CardContent className="p-3.5 flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isKas
                      ? "bg-emerald-500/10 text-emerald-600"
                      : isMember
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-purple-500/10 text-purple-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-foreground">{log.action}</span>
                      <Badge variant="outline" className="text-[10px] capitalize font-mono">
                        {log.module}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                      <Clock className="h-3 w-3" />
                      <span>
                        {log.timestamp ? log.timestamp.replace("T", " ").slice(0, 16) : "-"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-foreground/90 leading-relaxed">{log.description}</p>

                  <div className="pt-0.5 text-[10px] text-muted-foreground">
                    Dicatat oleh: <strong className="text-foreground">{log.actorName}</strong> (
                    {log.actorRole})
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

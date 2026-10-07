import { useActivityLogs } from "../logic/use-activity-logs";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldCheck, Wallet, Siren, FileText, Scale, UserCheck } from "lucide-react";

interface Props {
  roleFilter?: string;
  limit?: number;
}

export function ActivityLogView({ roleFilter, limit }: Props) {
  const { logs, selectedModule, setSelectedModule } = useActivityLogs(roleFilter);
  const displayLogs = limit ? logs.slice(0, limit) : logs;

  const getModuleIcon = (mod: string) => {
    switch (mod) {
      case "roles":
        return <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />;
      case "kas":
        return <Wallet className="h-3.5 w-3.5 text-emerald-600" />;
      case "kejadian":
        return <Siren className="h-3.5 w-3.5 text-rose-600" />;
      case "notulen":
        return <FileText className="h-3.5 w-3.5 text-blue-600" />;
      case "etik":
        return <Scale className="h-3.5 w-3.5 text-indigo-600" />;
      case "persetujuan":
        return <UserCheck className="h-3.5 w-3.5 text-purple-600" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-primary" />;
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3 pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Log Aktivitas & Audit Lintas Peran</h3>
        </div>

        <div className="flex gap-1 overflow-x-auto text-[11px] pb-1 sm:pb-0">
          {["all", "roles", "kas", "kejadian", "etik", "notulen"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedModule(m)}
              className={`rounded-lg px-2 py-0.5 font-semibold capitalize transition ${
                selectedModule === m
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {displayLogs.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          Belum ada catatan aktivitas untuk kategori ini.
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayLogs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-2.5 text-xs transition hover:bg-muted/40"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-card border border-border shadow-2xs">
                  {getModuleIcon(log.module)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-foreground truncate">{log.actorName}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-mono px-1.5 py-0"
                      >
                        {log.actorRole}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{timeStr}</span>
                  </div>

                  <div className="mt-0.5 font-semibold text-primary">{log.action}</div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                    {log.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

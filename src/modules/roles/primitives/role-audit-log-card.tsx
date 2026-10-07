import { RoleAuditLog } from "../types";
import { AVAILABLE_ROLES } from "../constants";
import { Badge } from "@/components/ui/badge";
import { History, FileText, ArrowRight } from "lucide-react";

interface Props {
  logs: RoleAuditLog[];
}

export function RoleAuditLogCard({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground">
        <History className="h-8 w-8 text-muted-foreground/50 mb-2" />
        Belum ada riwayat perubahan peran yang tercatat.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <History className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">
          Riwayat Audit Perubahan Jabatan Pengurus
        </h3>
      </div>

      <div className="space-y-3">
        {logs.map((log) => {
          const fromDef = AVAILABLE_ROLES.find((r) => r.id === log.fromRole);
          const toDef = AVAILABLE_ROLES.find((r) => r.id === log.toRole);
          const dateStr = new Date(log.timestamp).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={log.id}
              className="rounded-xl border border-border/70 bg-muted/20 p-3 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-foreground">{log.targetUserName}</span>
                <span className="text-[11px] text-muted-foreground">{dateStr}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="outline" className={`text-[10px] ${fromDef?.badgeClass}`}>
                  {fromDef?.name || log.fromRole}
                </Badge>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <Badge variant="outline" className={`text-[10px] ${toDef?.badgeClass}`}>
                  {toDef?.name || log.toRole}
                </Badge>
              </div>

              {log.skNumber && (
                <div className="flex items-center gap-1 text-[11px] text-primary font-mono font-medium">
                  <FileText className="h-3 w-3 shrink-0" />
                  <span>{log.skNumber}</span>
                </div>
              )}

              {log.notes && (
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  &ldquo;{log.notes}&rdquo;
                </p>
              )}

              <div className="text-[10px] text-muted-foreground/80 pt-1 border-t border-border/40">
                Ditetapkan oleh:{" "}
                <span className="font-semibold text-foreground">{log.changedByName}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

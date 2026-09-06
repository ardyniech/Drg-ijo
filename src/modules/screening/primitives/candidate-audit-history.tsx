import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { ScreeningAuditItem } from "../types";

interface Props {
  audit: ScreeningAuditItem[];
}

export function CandidateAuditHistory({ audit }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
        <History className="h-3.5 w-3.5" /> Riwayat perubahan status
      </div>
      {audit.length === 0 ? (
        <p className="text-xs text-muted-foreground">Belum ada perubahan tercatat.</p>
      ) : (
        <ol className="space-y-1.5">
          {audit.map((a) => (
            <li key={a.id} className="rounded border border-border p-2 text-xs">
              <div className="flex items-center justify-between">
                <span>
                  {a.old_status ? (
                    <>
                      <Badge variant="outline" className="mr-1">
                        {a.old_status}
                      </Badge>
                      →{" "}
                    </>
                  ) : null}
                  <Badge variant="outline">{a.new_status}</Badge>
                </span>
                <span className="text-muted-foreground">
                  {new Date(a.created_at).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="mt-1 text-muted-foreground">
                oleh {a.profiles?.nama ?? "sistem"}
                {a.note ? ` — "${a.note}"` : ""}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

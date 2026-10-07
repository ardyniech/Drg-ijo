import { useState } from "react";
import { EtikCase } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Calendar, MapPin, Scale, FileText } from "lucide-react";
import { EtikSkDialog } from "./etik-sk-dialog";

interface EtikCaseCardProps {
  item: EtikCase;
  onOpenAction: (item: EtikCase) => void;
}

const severityClasses: Record<EtikCase["severity"], string> = {
  Berat: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Sedang: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Ringan: "bg-blue-500/15 text-blue-700 border-blue-500/30",
};

const statusClasses: Record<EtikCase["status"], string> = {
  resolved: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  sanctioned: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  mediation_scheduled: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  investigating: "bg-slate-500/15 text-slate-700 border-slate-500/30",
};

const statusLabels: Record<EtikCase["status"], string> = {
  investigating: "Penyelidikan",
  mediation_scheduled: "Jadwal Mediasi",
  sanctioned: "Dikenakan Sanksi",
  resolved: "Selesai / Damai",
};

export function EtikCaseCard({ item, onOpenAction }: EtikCaseCardProps) {
  const [showSk, setShowSk] = useState(false);

  return (
    <>
      <Card className="rounded-2xl border border-border/70 shadow-warm transition-all hover:border-primary/40">
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-500/10 text-rose-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {item.caseNumber}
                  </span>
                  <Badge
                    variant="outline"
                    className={`px-2 py-0.5 text-[10px] ${severityClasses[item.severity]}`}
                  >
                    Tingkat {item.severity}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`px-2 py-0.5 text-[10px] ${statusClasses[item.status]}`}
                  >
                    {statusLabels[item.status]}
                  </Badge>
                </div>
                <h3 className="mt-1 font-display text-sm font-bold text-foreground">
                  {item.category}: {item.reportedMemberName} ({item.reportedMemberId})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSk(true)}
                className="h-8 gap-1 rounded-xl text-xs"
                title="Lihat SK"
              >
                <FileText className="h-3.5 w-3.5" /> SK
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenAction(item)}
                className="h-8 gap-1.5 rounded-xl text-xs font-semibold"
              >
                <Scale className="h-3.5 w-3.5" /> Sidang
              </Button>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground bg-muted/30 p-3 rounded-xl">
            {item.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> <span>{item.incidentDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> <span>{item.location}</span>
            </div>
          </div>

          {item.sanctionSummary && (
            <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-800">
              <strong>Keputusan:</strong> {item.sanctionSummary}
            </div>
          )}
        </CardContent>
      </Card>
      <EtikSkDialog item={item} open={showSk} onOpenChange={setShowSk} />
    </>
  );
}

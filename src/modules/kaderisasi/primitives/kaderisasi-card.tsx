import { useState } from "react";
import { MemberKaderisasi } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Award, ChevronRight } from "lucide-react";
import { KaderisasiCertificateDialog } from "./kaderisasi-certificate-dialog";
import { KaderisasiStatsGrid } from "./kaderisasi-stats-grid";

interface KaderisasiCardProps {
  item: MemberKaderisasi;
  onEvaluate: (item: MemberKaderisasi) => void;
}

export function KaderisasiCard({ item, onEvaluate }: KaderisasiCardProps) {
  const [showCert, setShowCert] = useState(false);

  const getBadgeVariant = (status: MemberKaderisasi["status"]) => {
    switch (status) {
      case "promoted":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
      case "eligible":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
      case "in_review":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
      default:
        return "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30";
    }
  };

  const statusLabel = {
    eligible: "Siap Evaluasi",
    in_review: "Sedang Ditinjau",
    promoted: "Telah Naik Jenjang",
    needs_improvement: "Perlu Pembinaan",
  }[item.status];

  return (
    <>
      <Card className="rounded-2xl border border-border/70 shadow-warm transition-all hover:border-primary/40">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-600">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-foreground">
                    {item.fullName}
                  </h3>
                  <Badge variant="outline" className="text-[11px] font-mono">
                    {item.memberId}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Jenjang:{" "}
                  <span className="font-semibold text-foreground">{item.currentLevel}</span>
                  {" → "}
                  <span className="font-semibold text-primary">{item.targetLevel}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCert(true)}
                className="gap-1 rounded-xl text-xs"
                title="Lihat Sertifikat"
              >
                <Award className="h-3.5 w-3.5 text-amber-600" /> Sertifikat
              </Button>
              <Badge
                variant="outline"
                className={`px-2.5 py-1 text-xs font-medium ${getBadgeVariant(item.status)}`}
              >
                {statusLabel}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEvaluate(item)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                Evaluasi <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <KaderisasiStatsGrid item={item} />

          <div className="mt-3.5">
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>Kelayakan Promosi</span>
              <span className="font-semibold text-foreground">{item.points}%</span>
            </div>
            <Progress value={item.points} className="h-2 rounded-full" />
          </div>
        </CardContent>
      </Card>
      <KaderisasiCertificateDialog member={item} open={showCert} onOpenChange={setShowCert} />
    </>
  );
}

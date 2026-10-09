import { MemberKaderisasi } from "../types";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface Props {
  member: MemberKaderisasi;
  notes: string;
  setNotes: (v: string) => void;
}

export function KaderisasiEvalBody({ member, notes, setNotes }: Props) {
  return (
    <div className="my-3 space-y-3">
      <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
        <h4 className="text-xs font-semibold text-foreground">
          Kriteria Jam Terbang & Solidaritas:
        </h4>
        <div className="mt-2 space-y-1.5">
          {member.requirements.map((req) => (
            <div key={req.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {req.met ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
                  {req.label}
                </span>
              </div>
              <span className="font-mono text-[11px] font-medium text-muted-foreground">
                +{req.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground">
          Catatan Rembug Pangkalan & Suhu Aspal
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tuliskan apresiasi, masukan jalur, atau pesan sedulur santui..."
          className="mt-1.5 h-20 text-xs"
        />
      </div>
    </div>
  );
}

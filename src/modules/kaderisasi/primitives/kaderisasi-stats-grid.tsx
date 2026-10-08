import { MemberKaderisasi } from "../types";

interface Props {
  item: MemberKaderisasi;
}

export function KaderisasiStatsGrid({ item }: Props) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3 sm:grid-cols-4">
      <div>
        <span className="text-[11px] text-muted-foreground">Poin Solidaritas</span>
        <p className="font-display text-sm font-bold text-foreground">{item.points} / 100</p>
      </div>
      <div>
        <span className="text-[11px] text-muted-foreground">Piket Basecamp</span>
        <p className="font-display text-sm font-bold text-foreground">
          {item.piketAttendanceCount} Shift
        </p>
      </div>
      <div>
        <span className="text-[11px] text-muted-foreground">Iuran Kas Aspal</span>
        <p className="font-display text-sm font-bold text-emerald-600">
          {item.kasCompliancePercent}%
        </p>
      </div>
      <div>
        <span className="text-[11px] text-muted-foreground">Syarat Jalur</span>
        <p className="font-display text-sm font-bold text-primary">
          {item.requirements.filter((r) => r.met).length}/{item.requirements.length} Lolos
        </p>
      </div>
    </div>
  );
}

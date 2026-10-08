import { Tx } from "../types";
import { useKasTransparencyData } from "../logic/use-kas-transparency-data";
import { KasTransparencyStats } from "./kas-transparency-stats";
import { KasTrendChart } from "./kas-trend-chart";
import { KasBreakdownChart } from "./kas-breakdown-chart";
import { KasContributionProgress } from "./kas-contribution-progress";
import { BarChart3, Lock } from "lucide-react";

interface KasTransparencyDashboardProps {
  rows: Tx[];
}

export function KasTransparencyDashboard({ rows }: KasTransparencyDashboardProps) {
  const { trendData, categoryBreakdown, statsSummary } = useKasTransparencyData(rows);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-emerald-800 dark:text-emerald-200">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            <strong>Dashboard Transparansi Publik:</strong> Seluruh data kas, iuran sosial, dan
            bantuan koperasi diverifikasi otomatis via buku kas terpusat.
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] font-semibold">
          <Lock className="h-3 w-3 text-emerald-600" /> Tervalidasi Audit
        </span>
      </div>

      <KasTransparencyStats summary={statsSummary} />

      <KasTrendChart data={trendData} />

      <KasBreakdownChart trendData={trendData} categories={categoryBreakdown} />

      <KasContributionProgress rows={rows} />
    </div>
  );
}

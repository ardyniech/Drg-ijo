import { useMemo } from "react";
import { Tx } from "../types";
import { MonthlyTrendPoint, CategoryBreakdownPoint, HISTORICAL_SEED } from "./kas-historical-data";

export type { MonthlyTrendPoint, CategoryBreakdownPoint };
export { HISTORICAL_SEED };

export function calculateTrendData(rows: Tx[]): MonthlyTrendPoint[] {
  const approvedRows = rows
    .filter((r) => r.status === "disetujui")
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  if (approvedRows.length === 0) return [];

  const monthlyMap = new Map<
    string,
    { sosial: number; koperasi: number; mas: number; kel: number }
  >();

  approvedRows.forEach((r) => {
    const d = new Date(r.tanggal);
    const monthKey = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
    const current = monthlyMap.get(monthKey) || { sosial: 0, koperasi: 0, mas: 0, kel: 0 };
    const val = Number(r.jumlah) || 0;

    if (r.jenis === "masuk") {
      current.mas += val;
      if (r.ledger === "sosial") current.sosial += val;
      else current.koperasi += val;
    } else {
      current.kel += val;
      if (r.ledger === "sosial") current.sosial = Math.max(0, current.sosial - val);
      else current.koperasi = Math.max(0, current.koperasi - val);
    }
    monthlyMap.set(monthKey, current);
  });

  return Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    sosial: data.sosial,
    koperasi: data.koperasi,
    pemasukan: data.mas,
    pengeluaran: data.kel,
  }));
}

export function calculateCategoryBreakdown(rows: Tx[]): CategoryBreakdownPoint[] {
  const categories: Record<string, number> = {};

  rows.forEach((r) => {
    if (r.status === "disetujui" && r.kategori) {
      const cat = r.kategori.trim();
      if (cat) {
        categories[cat] = (categories[cat] || 0) + (Number(r.jumlah) || 0);
      }
    }
  });

  const colors = ["#00B14F", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#10B981", "#6366F1"];
  return Object.entries(categories).map(([name, value], idx) => ({
    name,
    value,
    color: colors[idx % colors.length],
  }));
}

export function calculateStatsSummary(rows: Tx[]) {
  let totalSocial = 0;
  let totalCooperative = 0;
  let totalRelief = 0;
  const uniqueContributors = new Set<string>();
  let totalIncoming = 0;
  let approvedIncoming = 0;

  rows.forEach((r) => {
    const val = Number(r.jumlah) || 0;
    if (r.jenis === "masuk") {
      totalIncoming += 1;
      if (r.status === "disetujui") {
        approvedIncoming += 1;
        if (r.created_by) uniqueContributors.add(r.created_by);
      }
    }

    if (r.status === "disetujui") {
      if (r.ledger === "sosial") {
        if (r.jenis === "masuk") totalSocial += val;
        else {
          totalSocial = Math.max(0, totalSocial - val);
          totalRelief += val;
        }
      } else {
        if (r.jenis === "masuk") totalCooperative += val;
        else totalCooperative = Math.max(0, totalCooperative - val);
      }
    }
  });

  const complianceRate =
    totalIncoming > 0 ? Math.round((approvedIncoming / totalIncoming) * 1000) / 10 : 100;

  return {
    totalSocial: Math.max(0, totalSocial),
    totalCooperative: Math.max(0, totalCooperative),
    totalRelief,
    activeContributors: uniqueContributors.size,
    complianceRate,
  };
}

export function useKasTransparencyData(rows: Tx[]) {
  const trendData = useMemo(() => calculateTrendData(rows), [rows]);
  const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(rows), [rows]);
  const statsSummary = useMemo(() => calculateStatsSummary(rows), [rows]);

  return { trendData, categoryBreakdown, statsSummary };
}

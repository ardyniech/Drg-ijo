import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { MonthlyTrendPoint, CategoryBreakdownPoint } from "../logic/use-kas-transparency-data";
import { rupiah } from "../types";
import { KasCategoryPieCard } from "./kas-category-pie-card";

interface KasBreakdownChartProps {
  trendData: MonthlyTrendPoint[];
  categories: CategoryBreakdownPoint[];
}

export function KasBreakdownChart({ trendData, categories }: KasBreakdownChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const recentTrend = trendData.slice(-6);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-bold text-foreground">Inflow vs Outflow Bulanan</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Perbandingan Pemasukan Iuran dengan Penyaluran Bantuan
        </p>

        <div className="h-56 w-full text-xs">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Jt`}
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-xl border border-border bg-popover p-3 shadow-lg text-xs font-mono space-y-1">
                        <p className="font-sans font-bold text-popover-foreground mb-1">{label}</p>
                        <p className="text-emerald-600">
                          Pemasukan:{" "}
                          <span className="font-semibold">{rupiah(Number(payload[0]?.value))}</span>
                        </p>
                        <p className="text-amber-600">
                          Pengeluaran:{" "}
                          <span className="font-semibold">{rupiah(Number(payload[1]?.value))}</span>
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="pemasukan" name="Pemasukan" fill="#00B14F" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="pengeluaran"
                  name="Pengeluaran"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted/10 rounded-xl animate-pulse">
              Memuat grafik inflow vs outflow...
            </div>
          )}
        </div>
      </div>

      <KasCategoryPieCard mounted={mounted} categories={categories} />
    </div>
  );
}

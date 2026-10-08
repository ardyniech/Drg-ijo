import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MonthlyTrendPoint } from "../logic/use-kas-transparency-data";
import { KasTrendTooltip } from "./kas-trend-tooltip";

interface KasTrendChartProps {
  data: MonthlyTrendPoint[];
}

export function KasTrendChart({ data }: KasTrendChartProps) {
  const [timeframe, setTimeframe] = useState<"3M" | "6M" | "1Y">("6M");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const slicedData = data.slice(timeframe === "3M" ? -3 : timeframe === "6M" ? -6 : -12);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Tren Pertumbuhan Saldo Kas</h3>
          <p className="text-xs text-muted-foreground">
            Perkembangan akumulasi Dana Sosial dan Kas Koperasi DRG
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-xs">
          {(["3M", "6M", "1Y"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                timeframe === tf
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf === "3M" ? "3 Bulan" : tf === "6M" ? "6 Bulan" : "1 Tahun"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full text-xs">
        {data.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-xl p-6 text-center">
            <p className="font-semibold text-sm text-foreground">Belum ada riwayat transaksi kas</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Grafik pertumbuhan saldo akan otomatis muncul setelah transaksi disetujui oleh
              bendahara.
            </p>
          </div>
        ) : mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={slicedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSosial" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B14F" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00B14F" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorKoperasi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
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
              <Tooltip content={(props) => <KasTrendTooltip {...props} />} />
              <Area
                type="monotone"
                dataKey="sosial"
                name="Dana Sosial"
                stroke="#00B14F"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSosial)"
              />
              <Area
                type="monotone"
                dataKey="koperasi"
                name="Kas Koperasi"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorKoperasi)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted/10 rounded-xl animate-pulse">
            Memuat grafik tren...
          </div>
        )}
      </div>
    </div>
  );
}

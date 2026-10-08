import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { CategoryBreakdownPoint } from "../logic/use-kas-transparency-data";
import { rupiah } from "../types";

interface Props {
  mounted: boolean;
  categories: CategoryBreakdownPoint[];
}

export function KasCategoryPieCard({ mounted, categories }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-foreground">Alokasi & Sumber Dana</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Proporsi distribusi iuran dan dana bantuan komunitas
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="py-12 text-center text-xs text-muted-foreground bg-muted/10 rounded-xl my-auto">
          Belum ada data transaksi kas yang dikategorikan.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="h-44 w-44 shrink-0">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0];
                      return (
                        <div className="rounded-xl border border-border bg-popover p-2 shadow-lg text-xs font-mono">
                          <span className="font-sans font-bold">{item.name}: </span>
                          {rupiah(Number(item.value))}
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted/10 rounded-full animate-pulse">
                Memuat alokasi...
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-xs flex-1 w-full">
            {categories.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between border-b border-border/50 pb-1"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-foreground font-medium">{c.name}</span>
                </div>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {rupiah(c.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

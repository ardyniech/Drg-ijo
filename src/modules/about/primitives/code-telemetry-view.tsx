import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, HardDrive, Layers, Route, CheckCircle2 } from "lucide-react";
import rawTelemetry from "../data/live-code-telemetry.json";

export function CodeTelemetryView() {
  const t = rawTelemetry;

  const metrics = [
    {
      label: "Modul Arsitektur Aktif",
      value: `${t.totalModules} Modul`,
      sub: "Terisolasi mandiri di src/modules",
      icon: Layers,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      label: "Rute Aplikasi Live",
      value: `${t.totalRoutes} Rute`,
      sub: "TanStack Router type-safe",
      icon: Route,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Schema Basis Data Lokal",
      value: `${t.totalStorageSchemas} Koleksi`,
      sub: "Local-First Zod Storage Validated",
      icon: HardDrive,
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Tata Kelola Peran (RBAC)",
      value: `${t.rbacHierarchyLevels} Tingkat`,
      sub: "Hierarki jabatan & SK Mandat",
      icon: ShieldCheck,
      color: "text-purple-600 bg-purple-500/10",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            Telemetri Basis Kode Nyata
          </div>
          <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Inspeksi Kesehatan Sistem & Storage
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Data diperoleh otomatis dari kompilasi AST, file tree rute, dan storage keys aktif.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full self-start sm:self-auto">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>SOP v4.0 Zero-Mock & Local-First Active</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="border-border/70 shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">{m.label}</span>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${m.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-2 text-base font-bold font-mono text-foreground">{m.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{m.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-border/70 bg-card p-4 shadow-xs">
        <span className="text-xs font-semibold text-foreground">
          Koleksi Storage Lokal Terproteksi:
        </span>
        <div className="mt-2.5 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {t.storageKeys.map((key: string) => (
            <Badge
              key={key}
              variant="outline"
              className="font-mono text-[10px] text-muted-foreground"
            >
              {key}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

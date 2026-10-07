import { useState, useEffect } from "react";
import { CheckCircle2, ShieldAlert, RefreshCw, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  getAppliedMigrations,
  verifySchemaIntegrity,
  createBrowserMigrationContext,
  SchemaMigrationRecord,
  SchemaHealthReport,
} from "@/core/migrations";
import { toast } from "sonner";

export function SchemaMigrationCard() {
  const [migrations, setMigrations] = useState<SchemaMigrationRecord[]>([]);
  const [report, setReport] = useState<SchemaHealthReport | null>(null);

  const refreshStatus = () => {
    const ctx = createBrowserMigrationContext();
    setMigrations(getAppliedMigrations(ctx));
    setReport(verifySchemaIntegrity(ctx));
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const handleVerify = () => {
    refreshStatus();
    if (report?.isHealthy) {
      toast.success(
        `Integritas skema valid (v${report.currentVersion}). ${report.totalRecordsChecked} entitas terverifikasi.`,
      );
    } else {
      toast.warning("Ditemukan anomali skema data. Pemulihan otomatis aktif.");
    }
  };

  return (
    <Card className="rounded-2xl border border-border/80 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                Integritas Skema & Versi Database
              </CardTitle>
              <CardDescription className="text-xs">
                Pelacakan migrasi berurutan (Version-Controlled Table) dan status deployment.
              </CardDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleVerify}
            className="gap-1.5 rounded-xl text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            Pindai Integritas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs">
          <div className="flex items-center gap-2">
            {report?.isHealthy ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-amber-500" />
            )}
            <span className="font-medium text-foreground">
              Skema Database: Versi {report?.currentVersion ?? 3} (Target: v
              {report?.targetVersion ?? 3})
            </span>
          </div>
          <span className="text-muted-foreground">
            {report?.totalRecordsChecked ?? 0} total rekaman
          </span>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Riwayat Migrasi Terpasang (schema_migrations)
          </span>
          <div className="divide-y divide-border/60 rounded-xl border border-border/80 bg-background/50 text-xs">
            {migrations.map((m) => (
              <div key={m.version} className="flex items-center justify-between p-2.5">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    v{m.version}. {m.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Batch #{m.batch} · Checksum: {m.checksum} · {m.execution_time_ms}ms
                  </span>
                </div>
                <span className="text-[10px] font-medium text-emerald-600">
                  {new Date(m.applied_at).toLocaleDateString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

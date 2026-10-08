import { Button } from "@/components/ui/button";
import { UserPlus, Download } from "lucide-react";
import { MemberDirectoryStats } from "./member-directory-stats";

interface Props {
  total: number;
  verified: number;
  pending: number;
  pangkalan: number;
  canManage: boolean;
  onAddClick: () => void;
  onExportCsv?: () => void;
  selectedStatus?: string;
  onSelectStatus?: (status: string) => void;
}

export function MemberHeaderBar({
  total,
  verified,
  pending,
  pangkalan,
  canManage,
  onAddClick,
  onExportCsv,
  selectedStatus,
  onSelectStatus,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Ringkasan Keluarga Besar</h2>
          <p className="text-xs text-muted-foreground">
            Klik kartu status di bawah untuk filter cepat sedulur terdaftar di pangkalan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onExportCsv && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              className="gap-1.5 h-8 text-xs border-border/80"
              title="Unduh data sedulur format CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          )}
          {canManage && (
            <Button
              size="sm"
              onClick={onAddClick}
              className="gap-1.5 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 shadow-xs"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Tambah Sedulur</span>
            </Button>
          )}
        </div>
      </div>

      <MemberDirectoryStats
        total={total}
        verifiedCount={verified}
        pendingCount={pending}
        pangkalanCount={pangkalan}
        selectedStatus={selectedStatus}
        onSelectStatus={onSelectStatus}
      />
    </div>
  );
}

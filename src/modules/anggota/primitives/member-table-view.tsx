import { Users, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberRecord } from "../types";
import { MemberTableRow } from "./member-table-row";

interface MemberTableViewProps {
  members: MemberRecord[];
  isLoading: boolean;
  canManage?: boolean;
  canVerify?: boolean;
  onVerifyMember?: (id: string) => void;
  onSelectMember?: (member: MemberRecord) => void;
  onEditMember?: (member: MemberRecord) => void;
  onDeleteMember?: (member: MemberRecord) => void;
  onResetFilters: () => void;
}

export function MemberTableView({
  members,
  isLoading,
  canManage = false,
  canVerify = false,
  onVerifyMember,
  onSelectMember,
  onEditMember,
  onDeleteMember,
  onResetFilters,
}: MemberTableViewProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 rounded bg-muted/40 w-full" />
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
        <Users className="mx-auto h-9 w-9 text-muted-foreground/40 mb-3" />
        <h3 className="text-sm font-semibold text-foreground">
          Belum ada sedulur yang cocok di radar
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          Tidak ada data sedulur yang sesuai dengan filter atau kata kunci saat ini.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="mt-4 gap-1.5 rounded-lg text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Semua Filter
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-semibold text-muted-foreground">
              <th className="py-3 px-3.5">Sedulur & Kontak</th>
              <th className="py-3 px-3">No KTA</th>
              <th className="py-3 px-3">Pangkalan</th>
              <th className="py-3 px-3">Tingkat Aspal / Amanah</th>
              <th className="py-3 px-3">Armada Motor</th>
              <th className="py-3 px-3">Status Verif</th>
              <th className="py-3 px-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {members.map((m) => (
              <MemberTableRow
                key={m.id}
                member={m}
                canManage={canManage}
                canVerify={canVerify}
                onVerifyMember={onVerifyMember}
                onSelectMember={onSelectMember}
                onEditMember={onEditMember}
                onDeleteMember={onDeleteMember}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

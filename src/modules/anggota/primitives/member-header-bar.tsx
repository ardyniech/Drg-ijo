import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { MemberDirectoryStats } from "./member-directory-stats";

interface Props {
  total: number;
  verified: number;
  pending: number;
  pangkalan: number;
  canManage: boolean;
  onAddClick: () => void;
}

export function MemberHeaderBar({
  total,
  verified,
  pending,
  pangkalan,
  canManage,
  onAddClick,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <MemberDirectoryStats
        total={total}
        verifiedCount={verified}
        pendingCount={pending}
        pangkalanCount={pangkalan}
      />
      {canManage && (
        <Button
          onClick={onAddClick}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Tambah Anggota
        </Button>
      )}
    </div>
  );
}

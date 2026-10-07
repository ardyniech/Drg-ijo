import { useState } from "react";
import { Users, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberRecord } from "../types";
import { MemberCard } from "./member-card";
import { MemberDetailModal } from "./member-detail-modal";

interface MemberDirectoryGridProps {
  members: MemberRecord[];
  isLoading: boolean;
  onResetFilters: () => void;
  onVerifyMember?: (id: string) => void;
  canVerify?: boolean;
  canManage?: boolean;
  onEditMember?: (member: MemberRecord) => void;
  onDeleteMember?: (member: MemberRecord) => void;
}

export function MemberDirectoryGrid({
  members,
  isLoading,
  onResetFilters,
  onVerifyMember,
  canVerify = false,
  canManage = false,
  onEditMember,
  onDeleteMember,
}: MemberDirectoryGridProps) {
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-xl border border-border/80 bg-muted/20 animate-pulse p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-24 rounded bg-muted" />
                  <div className="h-2.5 w-16 rounded bg-muted" />
                </div>
              </div>
              <div className="h-5 w-14 rounded-full bg-muted" />
            </div>
            <div className="h-12 rounded bg-muted/60" />
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
        <Users className="mx-auto h-9 w-9 text-muted-foreground/40 mb-3" />
        <h3 className="text-sm font-semibold text-foreground">Tidak ada driver yang cocok</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          Tidak ditemukan data driver dengan filter atau kata kunci pencarian yang dipilih.
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
    <>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onSelect={(m) => setSelectedMember(m)}
            onEdit={onEditMember}
            onDelete={onDeleteMember}
            canManage={canManage}
          />
        ))}
      </div>

      <MemberDetailModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        onVerify={onVerifyMember}
        canVerify={canVerify}
      />
    </>
  );
}

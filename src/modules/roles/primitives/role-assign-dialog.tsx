import { useState, useEffect } from "react";
import { UserRole } from "@/hooks/use-me";
import { MemberRoleRecord } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { RoleMemberPreviewCard } from "./role-member-preview-card";
import { RoleAssignFormFields } from "./role-assign-form-fields";

interface Props {
  member: MemberRoleRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (params: {
    targetUserId: string;
    newRole: UserRole;
    skNumber?: string;
    notes?: string;
  }) => void;
  isLoading: boolean;
}

export function RoleAssignDialog({ member, open, onOpenChange, onAssign, isLoading }: Props) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("anggota");
  const [skNumber, setSkNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
      setSkNumber(
        `SK-PENGURUS/DRG/${new Date().getFullYear()}/${member.id.slice(-3).toUpperCase()}`,
      );
      setNotes("");
    }
  }, [member]);

  if (!member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign({
      targetUserId: member.id,
      newRole: selectedRole,
      skNumber:
        skNumber.trim() ||
        `SK-PENGURUS/DRG/${new Date().getFullYear()}/${member.id.slice(-3).toUpperCase()}`,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Penetapan Peran Organisasi
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <RoleMemberPreviewCard member={member} />

          <RoleAssignFormFields
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            skNumber={skNumber}
            onSkChange={setSkNumber}
            notes={notes}
            onNotesChange={setNotes}
          />

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="bg-primary text-primary-foreground"
            >
              {isLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Simpan & Terbitkan Mandat
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

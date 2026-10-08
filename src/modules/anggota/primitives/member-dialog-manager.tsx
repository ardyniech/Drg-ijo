import { MemberRecord } from "../types";
import { LocalUser } from "@/modules/auth/logic/local-auth-store";
import { NewMemberPayload } from "../storage/member-management-service";
import { MemberDetailModal } from "./member-detail-modal";
import { AddMemberDialog } from "./add-member-dialog";
import { EditMemberDialog } from "./edit-member-dialog";
import { DeleteMemberDialog } from "./delete-member-dialog";

interface Props {
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  selectedMember: MemberRecord | null;
  setSelectedMember: (m: MemberRecord | null) => void;
  editingMember: MemberRecord | null;
  setEditingMember: (m: MemberRecord | null) => void;
  deletingMember: MemberRecord | null;
  setDeletingMember: (m: MemberRecord | null) => void;
  addMember: (payload: NewMemberPayload) => Promise<unknown>;
  updateMember: (id: string, patch: Partial<LocalUser>) => Promise<unknown>;
  verifyMember: (id: string) => Promise<unknown>;
  deleteMember: (id: string) => Promise<unknown>;
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  canManage: boolean;
  canVerify: boolean;
}

export function MemberDialogManager({
  isAddOpen,
  setIsAddOpen,
  selectedMember,
  setSelectedMember,
  editingMember,
  setEditingMember,
  deletingMember,
  setDeletingMember,
  addMember,
  updateMember,
  verifyMember,
  deleteMember,
  isAdding,
  isUpdating,
  isDeleting,
  canManage,
  canVerify,
}: Props) {
  return (
    <>
      <MemberDetailModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        onVerify={verifyMember}
        canVerify={canVerify}
        onEdit={(m) => setEditingMember(m)}
        canManage={canManage}
      />

      <AddMemberDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onAdd={addMember}
        isAdding={isAdding}
      />

      <EditMemberDialog
        member={editingMember}
        open={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}
        onUpdate={updateMember}
        isUpdating={isUpdating}
      />

      <DeleteMemberDialog
        member={deletingMember}
        open={!!deletingMember}
        onOpenChange={(open) => !open && setDeletingMember(null)}
        onConfirmDelete={deleteMember}
        isDeleting={isDeleting}
      />
    </>
  );
}

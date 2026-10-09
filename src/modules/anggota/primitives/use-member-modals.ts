import { useState } from "react";
import { MemberRecord } from "../types";

export function useMemberModals() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [deletingMember, setDeletingMember] = useState<MemberRecord | null>(null);

  return {
    isAddOpen,
    setIsAddOpen,
    selectedMember,
    setSelectedMember,
    editingMember,
    setEditingMember,
    deletingMember,
    setDeletingMember,
  };
}

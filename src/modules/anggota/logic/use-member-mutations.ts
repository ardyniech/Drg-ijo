import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MemberManagementService, NewMemberPayload } from "../storage/member-management-service";
import { LocalUser } from "@/modules/auth/logic/local-auth-store";
import { toast } from "sonner";

export function useMemberMutations(actorRole?: string, actorId?: string) {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (payload: NewMemberPayload) => {
      return MemberManagementService.addMember(payload, actorRole);
    },
    onSuccess: (newMember) => {
      queryClient.invalidateQueries({ queryKey: ["anggota", "list"] });
      toast.success(`Anggota baru "${newMember.nama}" berhasil ditambahkan.`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<LocalUser> }) => {
      return MemberManagementService.updateMember(id, patch, actorRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anggota", "list"] });
      toast.success("Data anggota berhasil diperbarui.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (targetId: string) => {
      return MemberManagementService.deleteMember(targetId, actorId || "", actorRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anggota", "list"] });
      toast.success("Anggota berhasil dihapus.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    addMember: (p: NewMemberPayload) => addMutation.mutateAsync(p),
    updateMember: (id: string, patch: Partial<LocalUser>) =>
      updateMutation.mutateAsync({ id, patch }),
    deleteMember: (id: string) => deleteMutation.mutateAsync(id),
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

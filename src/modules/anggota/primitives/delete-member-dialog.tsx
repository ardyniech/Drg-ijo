import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { MemberRecord } from "../types";

interface Props {
  member: MemberRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: (id: string) => Promise<unknown>;
  isDeleting: boolean;
}

export function DeleteMemberDialog({
  member,
  open,
  onOpenChange,
  onConfirmDelete,
  isDeleting,
}: Props) {
  if (!member) return null;

  const handleDelete = async () => {
    await onConfirmDelete(member.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" /> Hapus Entri Anggota?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 text-xs">
            <p>
              Anda akan menghapus entri anggota <b>{member.nama}</b> ({member.no_kta}).
            </p>
            <p className="text-muted-foreground">
              Tindakan ini akan menghapus akun login dan profil anggota secara permanen dari
              database komunitas.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus Anggota
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

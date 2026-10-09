import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { NewMemberPayload } from "../storage/member-management-service";
import { MemberFormData, MemberFormFields } from "./member-form-fields";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (payload: NewMemberPayload) => Promise<unknown>;
  isAdding: boolean;
}

const INITIAL_FORM: MemberFormData = {
  nama: "",
  email: "",
  no_hp: "",
  role: "anggota",
  jenjang: "calon",
  status: "aktif",
  pangkalan: "",
  plat_nomor: "",
  jenis_kendaraan: "Sepeda Motor",
};

export function AddMemberDialog({ open, onOpenChange, onAdd, isAdding }: Props) {
  const [form, setForm] = useState<MemberFormData>(INITIAL_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(form);
    setForm(INITIAL_FORM);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" /> Tambah Anggota Baru
          </DialogTitle>
          <DialogDescription>
            Hanya Pengurus (Admin, Ketua, Dewan Etik) yang berwenang menambahkan entri anggota baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <MemberFormFields
            form={form}
            onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            isEdit={false}
          />

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isAdding}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isAdding}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Tambah Anggota
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

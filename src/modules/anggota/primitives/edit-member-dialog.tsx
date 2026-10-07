import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Edit } from "lucide-react";
import { MemberRecord } from "../types";
import { LocalUser } from "@/modules/auth/logic/local-auth-store";
import { MemberFormData, MemberFormFields } from "./member-form-fields";

interface Props {
  member: MemberRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, patch: Partial<LocalUser>) => Promise<unknown>;
  isUpdating: boolean;
}

export function EditMemberDialog({ member, open, onOpenChange, onUpdate, isUpdating }: Props) {
  const [form, setForm] = useState<MemberFormData>({
    nama: "",
    email: "",
    no_hp: "",
    role: "anggota",
    jenjang: "calon",
    status: "aktif",
    pangkalan: "",
    plat_nomor: "",
    jenis_kendaraan: "Sepeda Motor",
  });

  useEffect(() => {
    if (member) {
      setForm({
        nama: member.nama,
        email: member.email || "",
        no_hp: member.no_hp === "-" ? "" : member.no_hp,
        role: (member.role === "driver" ? "anggota" : member.role) as LocalUser["role"],
        jenjang: (member.jenjang.toLowerCase() as LocalUser["jenjang"]) || "calon",
        status: (member.status === "aktif" ? "aktif" : "pending_review") as LocalUser["status"],
        pangkalan: member.pangkalan || "Pangkalan Utama",
        plat_nomor: member.plat_nomor || "",
        jenis_kendaraan: member.jenis_kendaraan || "Sepeda Motor",
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    await onUpdate(member.id, {
      nama: form.nama,
      no_hp: form.no_hp,
      role: form.role,
      jenjang: form.jenjang,
      status: form.status,
      pangkalan: form.pangkalan,
      plat_nomor: form.plat_nomor,
      jenis_kendaraan: form.jenis_kendaraan,
    });
    onOpenChange(false);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" /> Edit Entri Anggota
          </DialogTitle>
          <DialogDescription>
            Ubah peran, jenjang kaderisasi, pangkalan, atau data operasional ({member.no_kta}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <MemberFormFields
            form={form}
            onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            isEdit={true}
          />

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

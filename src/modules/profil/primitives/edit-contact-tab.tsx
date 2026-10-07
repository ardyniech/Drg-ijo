import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { ProfileRow } from "../types";

interface Props {
  form: Partial<ProfileRow>;
  onChange: (patch: Partial<ProfileRow>) => void;
}

export function EditContactTab({ form, onChange }: Props) {
  return (
    <div className="space-y-4 py-2">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="edit-hp">Nomor HP / WhatsApp Utama</Label>
          <Input
            id="edit-hp"
            inputMode="tel"
            value={form.no_hp ?? ""}
            onChange={(e) => onChange({ no_hp: e.target.value })}
            placeholder="Contoh: 081234567890"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-email">Email Terdaftar</Label>
          <Input
            id="edit-email"
            type="email"
            value={form.email ?? ""}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="driver@drg.id"
          />
        </div>
      </div>

      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Kontak Darurat (Emergency Contact / SOS)
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="edit-darurat-nama" className="text-xs">
              Nama Kontak
            </Label>
            <Input
              id="edit-darurat-nama"
              value={form.kontak_darurat_nama ?? ""}
              onChange={(e) => onChange({ kontak_darurat_nama: e.target.value })}
              placeholder="Nama keluarga"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-darurat-hp" className="text-xs">
              Nomor HP Darurat
            </Label>
            <Input
              id="edit-darurat-hp"
              inputMode="tel"
              value={form.kontak_darurat_hp ?? ""}
              onChange={(e) => onChange({ kontak_darurat_hp: e.target.value })}
              placeholder="081987654321"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-darurat-hub" className="text-xs">
              Hubungan
            </Label>
            <Input
              id="edit-darurat-hub"
              value={form.kontak_darurat_hubungan ?? ""}
              onChange={(e) => onChange({ kontak_darurat_hubungan: e.target.value })}
              placeholder="Istri / Suami / Orang Tua"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

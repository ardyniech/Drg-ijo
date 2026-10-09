import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocalUser } from "@/modules/auth/logic/local-auth-store";
import { MemberVehicleFields } from "./member-vehicle-fields";
import { MemberRoleFields } from "./member-role-fields";

export interface MemberFormData {
  nama: string;
  email: string;
  no_hp: string;
  role: LocalUser["role"];
  jenjang: LocalUser["jenjang"];
  status: LocalUser["status"];
  pangkalan: string;
  plat_nomor: string;
  jenis_kendaraan: string;
}

interface Props {
  form: MemberFormData;
  onChange: (patch: Partial<MemberFormData>) => void;
  isEdit?: boolean;
}

export function MemberFormFields({ form, onChange, isEdit = false }: Props) {
  return (
    <div className="space-y-3.5 py-1 text-xs">
      <div className="space-y-1">
        <Label htmlFor="m-form-nama">Nama Lengkap *</Label>
        <Input
          id="m-form-nama"
          required
          value={form.nama}
          onChange={(e) => onChange({ nama: e.target.value })}
          placeholder="Contoh: Budi Santoso"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {!isEdit ? (
          <div className="space-y-1">
            <Label htmlFor="m-form-email">Email Login *</Label>
            <Input
              id="m-form-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="driver@drg.id"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <Label htmlFor="m-form-status">Status Anggota</Label>
            <Select
              value={form.status}
              onValueChange={(v) => onChange({ status: v as LocalUser["status"] })}
            >
              <SelectTrigger id="m-form-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif Terverifikasi</SelectItem>
                <SelectItem value="pending_review">Menunggu PIC</SelectItem>
                <SelectItem value="cuti">Cuti / Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="m-form-hp">Nomor HP / WhatsApp *</Label>
          <Input
            id="m-form-hp"
            required
            inputMode="tel"
            value={form.no_hp}
            onChange={(e) => onChange({ no_hp: e.target.value })}
            placeholder="081234567890"
          />
        </div>
      </div>

      <MemberRoleFields form={form} onChange={onChange} />
      <MemberVehicleFields form={form} onChange={onChange} />
    </div>
  );
}

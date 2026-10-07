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
                <SelectItem value="pending_review">Pending Review</SelectItem>
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="m-form-role">Peran / Jabatan</Label>
          <Select
            value={form.role}
            onValueChange={(v) => onChange({ role: v as LocalUser["role"] })}
          >
            <SelectTrigger id="m-form-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anggota">Anggota Driver</SelectItem>
              <SelectItem value="satgas">Satgas Lapangan</SelectItem>
              <SelectItem value="korlap">Korlap</SelectItem>
              <SelectItem value="bendahara">Bendahara</SelectItem>
              <SelectItem value="sekretaris">Sekretaris</SelectItem>
              <SelectItem value="dewan_etik">Dewan Etik</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="m-form-jenjang">Jenjang Karir</Label>
          <Select
            value={form.jenjang}
            onValueChange={(v) => onChange({ jenjang: v as LocalUser["jenjang"] })}
          >
            <SelectTrigger id="m-form-jenjang">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calon">Calon</SelectItem>
              <SelectItem value="muda">Muda</SelectItem>
              <SelectItem value="madya">Madya</SelectItem>
              <SelectItem value="purna">Purna</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <MemberVehicleFields form={form} onChange={onChange} />
    </div>
  );
}

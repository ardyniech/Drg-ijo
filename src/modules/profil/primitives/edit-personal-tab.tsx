import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileRow } from "../types";

interface Props {
  form: Partial<ProfileRow>;
  onChange: (patch: Partial<ProfileRow>) => void;
}

export function EditPersonalTab({ form, onChange }: Props) {
  return (
    <div className="space-y-4 py-2">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="edit-nama">Nama Lengkap</Label>
          <Input
            id="edit-nama"
            value={form.nama ?? ""}
            onChange={(e) => onChange({ nama: e.target.value })}
            placeholder="Nama lengkap sesuai KTP"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-dob">Tanggal Lahir</Label>
          <Input
            id="edit-dob"
            type="date"
            value={form.tanggal_lahir ?? ""}
            onChange={(e) => onChange({ tanggal_lahir: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-gender">Jenis Kelamin</Label>
          <Select
            value={form.jenis_kelamin ?? "L"}
            onValueChange={(v) => onChange({ jenis_kelamin: v as "L" | "P" })}
          >
            <SelectTrigger id="edit-gender">
              <SelectValue placeholder="Pilih Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-goldar">Golongan Darah</Label>
          <Select
            value={form.golongan_darah ?? "-"}
            onValueChange={(v) => onChange({ golongan_darah: v as "A" | "B" | "AB" | "O" | "-" })}
          >
            <SelectTrigger id="edit-goldar">
              <SelectValue placeholder="Pilih Golongan Darah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-">- (Belum Tahu)</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="AB">AB</SelectItem>
              <SelectItem value="O">O</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="edit-alamat">Alamat Domisili / KTP</Label>
        <Input
          id="edit-alamat"
          value={form.alamat ?? ""}
          onChange={(e) => onChange({ alamat: e.target.value })}
          placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="edit-bio">Bio / Catatan Driver</Label>
        <Textarea
          id="edit-bio"
          rows={2}
          value={form.bio ?? ""}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Tuliskan catatan singkat atau motto kamu…"
        />
      </div>
    </div>
  );
}

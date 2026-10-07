import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberFormData } from "./member-form-fields";

interface Props {
  form: MemberFormData;
  onChange: (patch: Partial<MemberFormData>) => void;
}

export function MemberVehicleFields({ form, onChange }: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="m-form-plat">Plat Nomor Kendaraan</Label>
          <Input
            id="m-form-plat"
            value={form.plat_nomor}
            onChange={(e) => onChange({ plat_nomor: e.target.value.toUpperCase() })}
            placeholder="N 1234 ABC"
            className="uppercase font-mono"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="m-form-kendaraan">Jenis Kendaraan</Label>
          <Select
            value={form.jenis_kendaraan}
            onValueChange={(v) => onChange({ jenis_kendaraan: v })}
          >
            <SelectTrigger id="m-form-kendaraan">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sepeda Motor">Sepeda Motor</SelectItem>
              <SelectItem value="Mobil Penumpang">Mobil Penumpang</SelectItem>
              <SelectItem value="Mobil Barang / Pickup">Pickup / Barang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="m-form-pangkalan">Pangkalan Operasional</Label>
        <Input
          id="m-form-pangkalan"
          value={form.pangkalan}
          onChange={(e) => onChange({ pangkalan: e.target.value })}
          placeholder="Contoh: Pangkalan Stasiun Kota"
        />
      </div>
    </>
  );
}

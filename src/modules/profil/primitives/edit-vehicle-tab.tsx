import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function EditVehicleTab({ form, onChange }: Props) {
  return (
    <div className="space-y-4 py-2">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="edit-plat">Plat Nomor Kendaraan</Label>
          <Input
            id="edit-plat"
            value={form.plat_nomor ?? ""}
            onChange={(e) => onChange({ plat_nomor: e.target.value.toUpperCase() })}
            placeholder="Contoh: N 1234 ABC"
            className="uppercase font-mono font-bold"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-jenis-kendaraan">Jenis Kendaraan</Label>
          <Select
            value={form.jenis_kendaraan ?? "Sepeda Motor"}
            onValueChange={(v) => onChange({ jenis_kendaraan: v })}
          >
            <SelectTrigger id="edit-jenis-kendaraan">
              <SelectValue placeholder="Pilih Jenis Kendaraan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sepeda Motor">Sepeda Motor</SelectItem>
              <SelectItem value="Mobil Penumpang">Mobil Penumpang</SelectItem>
              <SelectItem value="Mobil Barang / Pickup">Mobil Barang / Pickup</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-merk">Merk & Model Kendaraan</Label>
          <Input
            id="edit-merk"
            value={form.merk_kendaraan ?? ""}
            onChange={(e) => onChange({ merk_kendaraan: e.target.value })}
            placeholder="Contoh: Honda Vario 160 (2023)"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-stnk">Nomor STNK</Label>
          <Input
            id="edit-stnk"
            value={form.nomor_stnk ?? ""}
            onChange={(e) => onChange({ nomor_stnk: e.target.value })}
            placeholder="Contoh: 01234567/STNK/2023"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="edit-pangkalan">Pangkalan / Wilayah Operasional</Label>
        <Input
          id="edit-pangkalan"
          value={form.pangkalan ?? ""}
          onChange={(e) => onChange({ pangkalan: e.target.value })}
          placeholder="Contoh: Pangkalan Stasiun Kota Malang"
        />
      </div>
    </div>
  );
}

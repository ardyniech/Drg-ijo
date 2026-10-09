import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shift, slots } from "../types";

interface Props {
  tanggal: string;
  setTanggal: (v: string) => void;
  slot: Shift["slot"];
  setSlot: (v: Shift["slot"]) => void;
  wilayah: string;
  setWilayah: (v: string) => void;
  userId: string;
  setUserId: (v: string) => void;
  members: Array<{ id: string; nama: string }>;
  membersLoading: boolean;
}

export function NewShiftFormFields({
  tanggal,
  setTanggal,
  slot,
  setSlot,
  wilayah,
  setWilayah,
  userId,
  setUserId,
  members,
  membersLoading,
}: Props) {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Tanggal</Label>
          <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
        </div>
        <div>
          <Label>Slot</Label>
          <Select value={slot} onValueChange={(v) => setSlot(v as Shift["slot"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {slots.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Area Aktif / Posisi</Label>
        <Input
          value={wilayah}
          onChange={(e) => setWilayah(e.target.value)}
          placeholder="Di mana pun orderan bawa — ketik area posisimu"
        />
      </div>
      <div>
        <Label>Siapa Pegang Jaga</Label>
        <Select value={userId || "none"} onValueChange={setUserId}>
          <SelectTrigger>
            <SelectValue placeholder={membersLoading ? "Memuat anggota…" : "Belum ditentukan"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Belum ditentukan</SelectItem>
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
        Semua sedulur boleh ambil jaga — gantian jaga satu aspal sambil narik santui. Slot kosong
        bisa diisi dulur lain dari daftar aktif.
      </div>
    </div>
  );
}

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
import { Tx } from "../types";

interface Props {
  ledger: Tx["ledger"];
  onLedgerChange: (val: Tx["ledger"]) => void;
  jenis: Tx["jenis"];
  onJenisChange: (val: Tx["jenis"]) => void;
  jumlah: string;
  onJumlahChange: (val: string) => void;
  tanggal: string;
  onTanggalChange: (val: string) => void;
  kategori: string;
  onKategoriChange: (val: string) => void;
  deskripsi: string;
  onDeskripsiChange: (val: string) => void;
  onBuktiChange: (file: File | null) => void;
}

export function NewTxFormFields({
  ledger,
  onLedgerChange,
  jenis,
  onJenisChange,
  jumlah,
  onJumlahChange,
  tanggal,
  onTanggalChange,
  kategori,
  onKategoriChange,
  deskripsi,
  onDeskripsiChange,
  onBuktiChange,
}: Props) {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Buku Kas</Label>
          <Select value={ledger} onValueChange={onLedgerChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sosial">Kas Sosial Santunan</SelectItem>
              <SelectItem value="umum">Kas Koperasi Guyub</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Arus Kas</Label>
          <Select value={jenis} onValueChange={onJenisChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masuk">Urunan Masuk (+)</SelectItem>
              <SelectItem value="keluar">Penyaluran Santunan (-)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Nominal Urunan (Rp)</Label>
          <Input
            inputMode="numeric"
            value={jumlah}
            onChange={(e) => onJumlahChange(e.target.value.replace(/\D/g, ""))}
            placeholder="Contoh: 20000"
          />
        </div>
        <div>
          <Label>Tanggal</Label>
          <Input type="date" value={tanggal} onChange={(e) => onTanggalChange(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Kategori</Label>
        <Input
          value={kategori}
          onChange={(e) => onKategoriChange(e.target.value)}
          placeholder="Iuran bulanan, santunan mogok, ngopi kopdar…"
        />
      </div>
      <div>
        <Label>Catatan Seduluran</Label>
        <Textarea
          rows={2}
          value={deskripsi}
          onChange={(e) => onDeskripsiChange(e.target.value)}
          placeholder="Tuliskan keterangan urunan atau keperluan penyaluran..."
        />
      </div>
      <div>
        <Label>Bukti Transfer / Nota (opsional)</Label>
        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => onBuktiChange(e.target.files?.[0] ?? null)}
        />
      </div>
      <div className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
        Transaksi ≥ Rp 500.000 otomatis berstatus <b>menunggu verif</b> bendahara demi keterbukaan
        bareng.
      </div>
    </div>
  );
}

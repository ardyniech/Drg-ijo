import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { KasSkCategory } from "../types";
import { NewKasSkRecipient } from "./new-kas-sk-recipient";
import { NewKasSkAmountFields } from "./new-kas-sk-amount-fields";

interface Props {
  judul: string;
  setJudul: (v: string) => void;
  kategori: KasSkCategory;
  setKategori: (v: KasSkCategory) => void;
  nominal: string;
  setNominal: (v: string) => void;
  penerimaNama: string;
  setPenerimaNama: (v: string) => void;
  penerimaKta: string;
  setPenerimaKta: (v: string) => void;
  penerimaPangkalan: string;
  setPenerimaPangkalan: (v: string) => void;
  alasan: string;
  setAlasan: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function NewKasSkForm({
  judul,
  setJudul,
  kategori,
  setKategori,
  nominal,
  setNominal,
  penerimaNama,
  setPenerimaNama,
  penerimaKta,
  setPenerimaKta,
  penerimaPangkalan,
  setPenerimaPangkalan,
  alasan,
  setAlasan,
  onSubmit,
  onCancel,
  isPending,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 text-xs">
      <div>
        <label className="font-semibold text-foreground">Peruntukan / Judul SK</label>
        <Input
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Contoh: Santunan Laka Lantas Dulur Slamet"
          required
          className="mt-1 h-8 text-xs"
        />
      </div>

      <NewKasSkAmountFields
        kategori={kategori}
        setKategori={setKategori}
        nominal={nominal}
        setNominal={setNominal}
      />

      <NewKasSkRecipient
        penerimaNama={penerimaNama}
        setPenerimaNama={setPenerimaNama}
        penerimaKta={penerimaKta}
        setPenerimaKta={setPenerimaKta}
        penerimaPangkalan={penerimaPangkalan}
        setPenerimaPangkalan={setPenerimaPangkalan}
      />

      <div>
        <label className="font-semibold text-foreground">Alasan & Pertimbangan</label>
        <Textarea
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          placeholder="Jelaskan kondisi darurat dan musibah dulur yang dibantu..."
          className="mt-1 text-xs resize-none"
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="bg-primary text-primary-foreground"
        >
          {isPending ? "Menerbitkan..." : "Sahkan & Terbitkan"}
        </Button>
      </div>
    </form>
  );
}

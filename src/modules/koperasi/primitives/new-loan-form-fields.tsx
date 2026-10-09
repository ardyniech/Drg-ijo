import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewLoanFormFieldsProps {
  nama: string;
  setNama: (v: string) => void;
  kta: string;
  setKta: (v: string) => void;
  pangkalan: string;
  setPangkalan: (v: string) => void;
  nominal: string;
  setNominal: (v: string) => void;
  tenor: string;
  setTenor: (v: string) => void;
  keperluan: string;
  setKeperluan: (v: string) => void;
}

export function NewLoanFormFields({
  nama,
  setNama,
  kta,
  setKta,
  pangkalan,
  setPangkalan,
  nominal,
  setNominal,
  tenor,
  setTenor,
  keperluan,
  setKeperluan,
}: NewLoanFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-semibold text-foreground">Nama Lengkap</label>
          <Input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Pengemudi"
            required
            className="mt-1 h-8 text-xs"
          />
        </div>
        <div>
          <label className="font-semibold text-foreground">No. KTA</label>
          <Input
            value={kta}
            onChange={(e) => setKta(e.target.value)}
            placeholder="DRG-MLG-012"
            className="mt-1 h-8 text-xs"
          />
        </div>
      </div>

      <div>
        <label className="font-semibold text-foreground">Pangkalan Asal</label>
        <Input
          value={pangkalan}
          onChange={(e) => setPangkalan(e.target.value)}
          placeholder="Basecamp Arjosari Siaga"
          className="mt-1 h-8 text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-semibold text-foreground">Nominal (Rp)</label>
          <Input
            type="number"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            placeholder="500000"
            required
            className="mt-1 h-8 text-xs"
          />
        </div>
        <div>
          <label className="font-semibold text-foreground">Tenor (Minggu)</label>
          <Input
            type="number"
            value={tenor}
            onChange={(e) => setTenor(e.target.value)}
            min="1"
            max="12"
            className="mt-1 h-8 text-xs"
          />
        </div>
      </div>

      <div>
        <label className="font-semibold text-foreground">Keperluan / Kebutuhan</label>
        <Textarea
          value={keperluan}
          onChange={(e) => setKeperluan(e.target.value)}
          placeholder="Contoh: Ganti ban bocor, servis berkala, dll..."
          required
          className="mt-1 text-xs resize-none"
          rows={2}
        />
      </div>

      <div className="rounded-lg bg-emerald-500/10 p-2.5 text-[11px] text-emerald-800 border border-emerald-500/20">
        💡 Pinjaman Koperasi DRG bersifat gotong royong dengan <strong>bunga 0%</strong> tanpa
        potongan biaya admin.
      </div>
    </>
  );
}

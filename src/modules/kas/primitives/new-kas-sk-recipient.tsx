import { Input } from "@/components/ui/input";

interface Props {
  penerimaNama: string;
  setPenerimaNama: (v: string) => void;
  penerimaKta: string;
  setPenerimaKta: (v: string) => void;
  penerimaPangkalan: string;
  setPenerimaPangkalan: (v: string) => void;
}

export function NewKasSkRecipient({
  penerimaNama,
  setPenerimaNama,
  penerimaKta,
  setPenerimaKta,
  penerimaPangkalan,
  setPenerimaPangkalan,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-semibold text-foreground">Nama Penerima</label>
          <Input
            value={penerimaNama}
            onChange={(e) => setPenerimaNama(e.target.value)}
            placeholder="Nama Dulur / Ahli Waris"
            required
            className="mt-1 h-8 text-xs"
          />
        </div>
        <div>
          <label className="font-semibold text-foreground">Nomor KTA</label>
          <Input
            value={penerimaKta}
            onChange={(e) => setPenerimaKta(e.target.value)}
            placeholder="DRG-MLG-045"
            className="mt-1 h-8 text-xs"
          />
        </div>
      </div>

      <div>
        <label className="font-semibold text-foreground">Pangkalan Asal</label>
        <Input
          value={penerimaPangkalan}
          onChange={(e) => setPenerimaPangkalan(e.target.value)}
          placeholder="Contoh: Posko Arjosari Siaga"
          className="mt-1 h-8 text-xs"
        />
      </div>
    </>
  );
}

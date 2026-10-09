import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useKasSk } from "../logic/use-kas-sk";
import { KasSkCategory } from "../types";

export function NewKasSkDialog() {
  const [open, setOpen] = useState(false);
  const { createSk } = useKasSk();

  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState<KasSkCategory>("santunan_laka");
  const [nominal, setNominal] = useState("");
  const [penerimaNama, setPenerimaNama] = useState("");
  const [penerimaKta, setPenerimaKta] = useState("");
  const [penerimaPangkalan, setPenerimaPangkalan] = useState("");
  const [alasan, setAlasan] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !nominal || !penerimaNama) return;

    createSk.mutate(
      {
        tanggal: new Date().toISOString().split("T")[0],
        kategori,
        judul,
        nominal: Number(nominal),
        penerima_nama: penerimaNama,
        penerima_kta: penerimaKta || "DRG-MLG-000",
        penerima_pangkalan: penerimaPangkalan || "Pangkalan Umum",
        alasan,
        dasar_keputusan: "Musyawarah Pengurus Harian & SK Mandat Kas Gotong Royong",
        nama_ketua: "H. Hendra Wijaya",
        nama_bendahara: "Hj. Siti Rahmawati",
        status: "disahkan",
      },
      {
        onSuccess: () => {
          setOpen(false);
          setJudul("");
          setNominal("");
          setPenerimaNama("");
          setAlasan("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground">
          <PlusCircle className="h-4 w-4" /> Terbitkan SK Kas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Terbitkan SK Kas Gotong Royong</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-foreground">Kategori Santunan</label>
              <Select value={kategori} onValueChange={(v) => setKategori(v as KasSkCategory)}>
                <SelectTrigger className="mt-1 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="santunan_laka">Laka Lantas</SelectItem>
                  <SelectItem value="santunan_duka">Santunan Duka</SelectItem>
                  <SelectItem value="bantuan_kesehatan">Bantuan Medis</SelectItem>
                  <SelectItem value="bantuan_kendaraan">Mogok/Perbaikan</SelectItem>
                  <SelectItem value="modal_koperasi">Modal Koperasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Nominal (Rp)</label>
              <Input
                type="number"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="1500000"
                required
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>

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
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createSk.isPending}
              className="bg-primary text-primary-foreground"
            >
              {createSk.isPending ? "Menerbitkan..." : "Sahkan & Terbitkan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

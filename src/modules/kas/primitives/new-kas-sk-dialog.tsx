import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useKasSk } from "../logic/use-kas-sk";
import { KasSkCategory } from "../types";
import { NewKasSkForm } from "./new-kas-sk-form";

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

        <NewKasSkForm
          judul={judul}
          setJudul={setJudul}
          kategori={kategori}
          setKategori={setKategori}
          nominal={nominal}
          setNominal={setNominal}
          penerimaNama={penerimaNama}
          setPenerimaNama={setPenerimaNama}
          penerimaKta={penerimaKta}
          setPenerimaKta={setPenerimaKta}
          penerimaPangkalan={penerimaPangkalan}
          setPenerimaPangkalan={setPenerimaPangkalan}
          alasan={alasan}
          setAlasan={setAlasan}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isPending={createSk.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

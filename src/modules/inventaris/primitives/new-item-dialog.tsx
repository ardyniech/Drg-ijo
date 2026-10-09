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
import { useInventaris } from "../logic/use-inventaris";
import { InventarisItem } from "../types";
import { NewItemForm } from "./new-item-form";

export function NewItemDialog() {
  const [open, setOpen] = useState(false);
  const { addItem } = useInventaris();

  const [namaBarang, setNamaBarang] = useState("");
  const [kodeAlat, setKodeAlat] = useState("");
  const [kategori, setKategori] = useState<InventarisItem["kategori"]>("Komunikasi");
  const [kondisi, setKondisi] = useState<InventarisItem["kondisi"]>("Sangat Baik");
  const [lokasiPos, setLokasiPos] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBarang || !lokasiPos) return;

    addItem.mutate(
      {
        nama_barang: namaBarang,
        kode_alat: kodeAlat || `POS-${Math.floor(100 + Math.random() * 900)}`,
        kategori,
        kondisi,
        lokasi_pos: lokasiPos,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNamaBarang("");
          setKodeAlat("");
          setLokasiPos("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground text-xs">
          <PlusCircle className="h-3.5 w-3.5" /> Tambah Perlengkapan Pos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Daftarkan Alat / Perlengkapan Posko
          </DialogTitle>
        </DialogHeader>

        <NewItemForm
          namaBarang={namaBarang}
          setNamaBarang={setNamaBarang}
          kodeAlat={kodeAlat}
          setKodeAlat={setKodeAlat}
          kategori={kategori}
          setKategori={setKategori}
          kondisi={kondisi}
          setKondisi={setKondisi}
          lokasiPos={lokasiPos}
          setLokasiPos={setLokasiPos}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isPending={addItem.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

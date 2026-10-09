import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, HandCoins } from "lucide-react";
import { useKoperasi } from "../logic/use-koperasi";
import { NewLoanFormFields } from "./new-loan-form-fields";

export function NewLoanDialog() {
  const [open, setOpen] = useState(false);
  const { createLoan } = useKoperasi();

  const [nama, setNama] = useState("");
  const [kta, setKta] = useState("");
  const [pangkalan, setPangkalan] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [nominal, setNominal] = useState("500000");
  const [tenor, setTenor] = useState("5");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !keperluan || !nominal) return;

    createLoan.mutate(
      {
        nama_peminjam: nama,
        kta_peminjam: kta || "DRG-MLG-000",
        pangkalan: pangkalan || "Basecamp Siaga",
        keperluan,
        nominal: Number(nominal),
        tenor_minggu: Number(tenor),
        status: "diajukan",
        tanggal_pengajuan: new Date().toISOString().split("T")[0],
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNama("");
          setKeperluan("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground text-xs">
          <PlusCircle className="h-3.5 w-3.5" /> Ajukan Pinjaman Koperasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <HandCoins className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold">Pengajuan Pinjaman Darurat 0%</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <NewLoanFormFields
            nama={nama}
            setNama={setNama}
            kta={kta}
            setKta={setKta}
            pangkalan={pangkalan}
            setPangkalan={setPangkalan}
            nominal={nominal}
            setNominal={setNominal}
            tenor={tenor}
            setTenor={setTenor}
            keperluan={keperluan}
            setKeperluan={setKeperluan}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createLoan.isPending}
              className="bg-primary text-primary-foreground"
            >
              {createLoan.isPending ? "Mengajukan..." : "Kirim Pengajuan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

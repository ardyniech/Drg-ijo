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
import { PlusCircle, HandCoins } from "lucide-react";
import { useKoperasi } from "../logic/use-koperasi";

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

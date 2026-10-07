import { useState } from "react";
import { HandHelping, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useInventaris } from "../logic/use-inventaris";
import { useMe } from "@/hooks/use-me";
import { InventarisItem } from "../types";

export function PinjamDialog({ item }: { item: InventarisItem }) {
  const [open, setOpen] = useState(false);
  const { data: me } = useMe();
  const { pinjamItem } = useInventaris();

  const [nama, setNama] = useState(me?.nama || "");
  const [phone, setPhone] = useState((me as { no_hp?: string } | null)?.no_hp || "081234567890");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNama = nama.trim();
    const cleanPhone = phone.trim();
    if (!cleanNama || !cleanPhone) {
      toast.error("Nama dan nomor WhatsApp wajib diisi");
      return;
    }

    pinjamItem.mutate({
      id: item.id,
      peminjam_nama: cleanNama,
      peminjam_phone: cleanPhone,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 text-xs border-primary/40 text-primary">
          <HandHelping className="mr-1 h-3.5 w-3.5" /> Pinjam
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Form Peminjaman Alat Satgas</DialogTitle>
            <DialogDescription>
              Pinjam <strong>{item.nama_barang}</strong> ({item.kode_alat}) untuk keperluan darurat
              atau pengawalan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="space-y-1">
              <Label>Nama Driver / Satgas</Label>
              <Input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama peminjam"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Nomor WhatsApp Aktif</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Harap mengembalikan barang dalam kondisi baik dan melaporkan pengembalian di pos{" "}
              <strong>{item.lokasi_pos}</strong>.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={pinjamItem.isPending || !nama.trim() || !phone.trim()}
              className="bg-primary text-primary-foreground"
            >
              {pinjamItem.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Konfirmasi Pinjam
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

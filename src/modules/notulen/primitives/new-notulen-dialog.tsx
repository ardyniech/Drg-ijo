import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
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
import { useNotulen } from "../logic/use-notulen";
import { useMe } from "@/hooks/use-me";
import { NewNotulenFormFields } from "./new-notulen-form-fields";

export function NewNotulenDialog() {
  const [open, setOpen] = useState(false);
  const { data: me } = useMe();
  const { createNotulen } = useNotulen();

  const [judul, setJudul] = useState("");
  const [lokasi, setLokasi] = useState("Basecamp Utama Suhat");
  const [agenda, setAgenda] = useState("");
  const [keputusanRaw, setKeputusanRaw] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanJudul = judul.trim();
    const cleanAgenda = agenda.trim();
    if (!cleanJudul || !cleanAgenda) {
      toast.error("Judul dan agenda rapat wajib diisi");
      return;
    }

    const poin_keputusan = keputusanRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    createNotulen.mutate({
      judul: cleanJudul,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      lokasi: lokasi.trim() || "Basecamp Utama Suhat",
      pemimpin_rapat: me?.nama || "Ketua Komunitas",
      notulis: me?.nama || "Sekretaris DRG",
      peserta_count: 20,
      agenda: cleanAgenda,
      poin_keputusan:
        poin_keputusan.length > 0 ? poin_keputusan : ["Semua agenda telah disetujui bersama."],
      status: "disahkan",
    });

    setOpen(false);
    setJudul("");
    setAgenda("");
    setKeputusanRaw("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground gap-2">
          <PlusCircle className="h-4 w-4" /> Catat Notulen Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Notulen Musyawarah Baru</DialogTitle>
            <DialogDescription>
              Catat hasil rapat dan keputusan penting musyawarah komunitas DRG secara transparan.
            </DialogDescription>
          </DialogHeader>

          <NewNotulenFormFields
            judul={judul}
            setJudul={setJudul}
            lokasi={lokasi}
            setLokasi={setLokasi}
            agenda={agenda}
            setAgenda={setAgenda}
            keputusanRaw={keputusanRaw}
            setKeputusanRaw={setKeputusanRaw}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createNotulen.isPending || !judul.trim() || !agenda.trim()}
              className="bg-primary text-primary-foreground"
            >
              {createNotulen.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Simpan & Sahkan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

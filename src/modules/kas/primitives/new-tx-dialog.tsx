import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Tx } from "../types";
import { NewTxFormFields } from "./new-tx-form-fields";

export function NewTxDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [ledger, setLedger] = useState<Tx["ledger"]>("sosial");
  const [jenis, setJenis] = useState<Tx["jenis"]>("masuk");
  const [jumlah, setJumlah] = useState("");
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [bukti, setBukti] = useState<File | null>(null);

  const mut = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Butuh sesi");
      let bukti_path: string | null = null;
      if (bukti) {
        const path = `${u.user.id}/${Date.now()}-${bukti.name}`;
        const { error } = await supabase.storage.from("bukti-kas").upload(path, bukti);
        if (error) throw error;
        bukti_path = path;
      }
      const { error } = await supabase.from("kas_transactions").insert({
        ledger,
        jenis,
        jumlah: Number(jumlah || 0),
        kategori: kategori || undefined,
        deskripsi: deskripsi || undefined,
        tanggal,
        bukti_path,
        created_by: u.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Transaksi disimpan");
      qc.invalidateQueries({ queryKey: ["kas-tx"] });
      setOpen(false);
      setJumlah("");
      setKategori("");
      setDeskripsi("");
      setBukti(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Transaksi baru</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Transaksi kas baru</DialogTitle></DialogHeader>
        <NewTxFormFields
          ledger={ledger}
          onLedgerChange={setLedger}
          jenis={jenis}
          onJenisChange={setJenis}
          jumlah={jumlah}
          onJumlahChange={setJumlah}
          tanggal={tanggal}
          onTanggalChange={setTanggal}
          kategori={kategori}
          onKategoriChange={setKategori}
          deskripsi={deskripsi}
          onDeskripsiChange={setDeskripsi}
          onBuktiChange={setBukti}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={() => mut.mutate()} disabled={mut.isPending || !jumlah}>
            {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Shift, slots } from "../types";
import { useMemberOptions } from "../storage/use-member-options";

interface Props {
  defaultDate: string;
  onDone: () => void;
}

export function NewShiftDialog({ defaultDate, onDone }: Props) {
  const [open, setOpen] = useState(false);
  const [tanggal, setTanggal] = useState(defaultDate);
  const [slot, setSlot] = useState<Shift["slot"]>("pagi");
  const [wilayah, setWilayah] = useState("");
  const [userId, setUserId] = useState("");
  const { data: members = [], isLoading: membersLoading } = useMemberOptions();

  const mut = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const payload: Record<string, unknown> = { tanggal, slot };
      if (wilayah) payload.wilayah = wilayah;
      if (userId && userId !== "none") payload.user_id = userId;
      if (u.user?.id) payload.created_by = u.user.id;
      const { error } = await supabase.from("piket_shifts").insert(payload as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Shift ditambahkan");
      setOpen(false);
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Shift baru</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Tambah shift piket</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tanggal</Label>
              <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
            </div>
            <div>
              <Label>Slot</Label>
              <Select value={slot} onValueChange={(v) => setSlot(v as Shift["slot"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {slots.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Wilayah</Label>
            <Input value={wilayah} onChange={(e) => setWilayah(e.target.value)} placeholder="Malang Kota / Barat / dsb" />
          </div>
          <div>
            <Label>Petugas</Label>
            <Select value={userId || "none"} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder={membersLoading ? "Memuat anggota…" : "Belum ditentukan"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Belum ditentukan</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-lg bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
            Pilih anggota aktif dari daftar. Shift tanpa petugas akan tampil sebagai slot terbuka.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
            {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

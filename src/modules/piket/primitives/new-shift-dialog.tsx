import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { recordActivityLog } from "@/modules/activity-log";
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
import { Shift } from "../types";
import { useMemberOptions } from "../storage/use-member-options";
import { NewShiftFormFields } from "./new-shift-form-fields";

interface Props {
  defaultDate: string;
  onDone: () => void;
}

export function NewShiftDialog({ defaultDate, onDone }: Props) {
  const qc = useQueryClient();
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
      const cleanWilayah = wilayah.trim();
      if (cleanWilayah) payload.wilayah = cleanWilayah;
      if (userId && userId !== "none") payload.user_id = userId;
      if (u.user?.id) payload.created_by = u.user.id;
      const { error } = await supabase.from("piket_shifts").insert(payload as never);
      if (error) throw error;
      return { cleanWilayah, u: u.user };
    },
    onSuccess: ({ cleanWilayah, u }) => {
      toast.success("Jadwal shift piket berhasil ditambahkan");
      recordActivityLog({
        actorId: u?.id || "korlap-piket",
        actorName: u?.user_metadata?.nama || "Korlap Satgas",
        actorRole: "korlap",
        action: "Penjadwalan Shift Piket",
        module: "piket",
        description: `Menambahkan jadwal piket tanggal ${tanggal} slot ${slot} (${cleanWilayah || "Pangkalan Umum"}).`,
      });
      qc.invalidateQueries({ queryKey: ["piket"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      setOpen(false);
      onDone();
    },
    onError: (e: Error) => toast.error("Gagal menambahkan shift", { description: e.message }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" /> Shift baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah shift piket</DialogTitle>
        </DialogHeader>
        <NewShiftFormFields
          tanggal={tanggal}
          setTanggal={setTanggal}
          slot={slot}
          setSlot={setSlot}
          wilayah={wilayah}
          setWilayah={setWilayah}
          userId={userId}
          setUserId={setUserId}
          members={members}
          membersLoading={membersLoading}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={() => mut.mutate()} disabled={mut.isPending || !tanggal}>
            {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

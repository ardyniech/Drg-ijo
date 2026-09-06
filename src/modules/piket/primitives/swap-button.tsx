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
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useMemberOptions } from "../storage/use-member-options";

interface Props {
  shiftId: string;
  currentUserId: string;
}

export function SwapButton({ shiftId, currentUserId }: Props) {
  const [open, setOpen] = useState(false);
  const [alasan, setAlasan] = useState("");
  const [target, setTarget] = useState("");
  const { data: members = [] } = useMemberOptions();

  const submit = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        shift_id: shiftId,
        requested_by: currentUserId,
        status: "menunggu",
      };
      if (target && target !== "open") payload.target_user_id = target;
      if (alasan) payload.alasan = alasan;
      const { error } = await supabase.from("piket_swap_requests").insert(payload as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Permintaan tukar dikirim");
      setOpen(false);
      setAlasan("");
      setTarget("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline">
          <RefreshCw className="h-3 w-3" /> Tukar
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Ajukan tukar shift</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Rekan tujuan</Label>
            <Select value={target || "open"} onValueChange={setTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Terbuka untuk siapa saja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Terbuka untuk siapa saja</SelectItem>
                {members
                  .filter((m) => m.id !== currentUserId)
                  .map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nama}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Alasan</Label>
            <Input value={alasan} onChange={(e) => setAlasan(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={() => submit.mutate()} disabled={submit.isPending}>
            {submit.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Kirim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

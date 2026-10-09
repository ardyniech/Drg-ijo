import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { recordActivityLog } from "@/modules/activity-log";
import { enqueueOperation } from "@/core/sync";
import { NotulenStorage } from "../storage/notulen-storage";
import { NotulenRecord } from "../types";

export function useNotulen() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notulen", "list"],
    queryFn: async (): Promise<NotulenRecord[]> => NotulenStorage.getNotulen(),
  });

  const createNotulen = useMutation({
    mutationFn: async (item: Omit<NotulenRecord, "id" | "created_at">) => {
      const current = NotulenStorage.getNotulen();
      const newRecord: NotulenRecord = {
        ...item,
        id: `not-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      NotulenStorage.saveNotulen([newRecord, ...current]);
      return newRecord;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notulen"] });
      enqueueOperation({
        idempotencyKey: data.id,
        action: "Terbitin Catatan Rembug",
        module: "persetujuan",
        payload: { id: data.id, judul: data.judul },
      });
      recordActivityLog({
        actorId: "sekretaris-01",
        actorName: "Siti Rahmawati",
        actorRole: "sekretaris",
        action: "Terbitin Catatan Rembug",
        module: "notulen",
        description: `Mengesahkan berita acara musyawarah rapat "${data.judul}".`,
      });
      toast.success("Notulen rapat berhasil dicatat & disahkan");
    },
  });

  return {
    notulenList: query.data ?? [],
    isLoading: query.isLoading,
    createNotulen,
  };
}

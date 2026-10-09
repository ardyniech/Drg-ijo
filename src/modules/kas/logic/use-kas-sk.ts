import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KasSkRecord } from "../types";
import { KasSkStorage } from "../storage/kas-sk-storage";
import { recordActivityLog } from "@/modules/activity-log";
import { enqueueOperation } from "@/core/sync";

export function useKasSk() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["kas-sk", "list"],
    queryFn: async (): Promise<KasSkRecord[]> => KasSkStorage.getAll(),
  });

  const createSk = useMutation({
    mutationFn: async (payload: Omit<KasSkRecord, "id" | "no_sk" | "created_at">) => {
      return KasSkStorage.create(payload);
    },
    onSuccess: (record) => {
      queryClient.invalidateQueries({ queryKey: ["kas-sk"] });
      enqueueOperation({
        idempotencyKey: `sk-kas-create-${record.id}`,
        action: "Penerbitan SK Kas Gotong Royong",
        module: "kas",
        payload: { id: record.id, no_sk: record.no_sk, nominal: record.nominal },
      });
      recordActivityLog({
        actorId: "usr-bendahara",
        actorName: record.nama_bendahara,
        actorRole: "bendahara",
        action: "Penerbitan SK Kas Gotong Royong",
        module: "kas",
        description: `Penerbitan ${record.no_sk}: ${record.judul} sebesar Rp${record.nominal.toLocaleString("id-ID")}`,
      });
      toast.success(`SK Kas Gotong Royong ${record.no_sk} berhasil diterbitkan`);
    },
  });

  const cairkanSk = useMutation({
    mutationFn: async (id: string) => {
      const rec = KasSkStorage.updateStatus(id, "dicairkan");
      if (!rec) throw new Error("SK tidak ditemukan");
      return rec;
    },
    onSuccess: (rec) => {
      queryClient.invalidateQueries({ queryKey: ["kas-sk"] });
      enqueueOperation({
        idempotencyKey: `sk-kas-disburse-${rec.id}`,
        action: "Pencairan Dana SK Kas",
        module: "kas",
        payload: { id: rec.id, no_sk: rec.no_sk },
      });
      recordActivityLog({
        actorId: "usr-bendahara",
        actorName: rec.nama_bendahara,
        actorRole: "bendahara",
        action: "Pencairan Dana SK Kas",
        module: "kas",
        description: `Dana santunan berdasarkan ${rec.no_sk} sebesar Rp${rec.nominal.toLocaleString("id-ID")} resmi dicairkan ke ${rec.penerima_nama}.`,
      });
      toast.success(`Dana SK ${rec.no_sk} resmi dicairkan ke penerima`);
    },
  });

  return {
    records: query.data ?? [],
    isLoading: query.isLoading,
    createSk,
    cairkanSk,
  };
}

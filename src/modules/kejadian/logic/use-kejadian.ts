import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { recordActivityLog } from "@/modules/activity-log";
import { enqueueOperation } from "@/core/sync";
import { KejadianStorage } from "../storage/kejadian-storage";
import { IncidentRecord, IncidentCategory, IncidentSeverity, IncidentStatus } from "../types";

export function useKejadian() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["kejadian", "list"],
    queryFn: async (): Promise<IncidentRecord[]> => KejadianStorage.getIncidents(),
    refetchInterval: 5000,
  });

  const createIncident = useMutation({
    mutationFn: async (payload: {
      driver_id: string;
      driver_name: string;
      driver_phone: string;
      kategori: IncidentCategory;
      tingkat: IncidentSeverity;
      deskripsi: string;
      lat?: number;
      lng?: number;
      lokasi_teks?: string;
    }) => {
      const current = KejadianStorage.getIncidents();
      const newRecord: IncidentRecord = {
        id: `sos-${Date.now()}`,
        driver_id: payload.driver_id,
        driver_name: payload.driver_name,
        driver_phone: payload.driver_phone,
        kategori: payload.kategori,
        tingkat: payload.tingkat,
        deskripsi: payload.deskripsi,
        lat: payload.lat || -7.9666,
        lng: payload.lng || 112.6326,
        lokasi_teks: payload.lokasi_teks || "Lokasi saat ini (GPS)",
        status: "aktif",
        responders: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      KejadianStorage.saveIncidents([newRecord, ...current]);
      return newRecord;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["kejadian"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      enqueueOperation({
        idempotencyKey: data.id,
        action: "Sinyal SOS Darurat",
        module: "kejadian",
        payload: { id: data.id, kategori: data.kategori, lokasi: data.lokasi_teks },
      });
      recordActivityLog({
        actorId: data.driver_id,
        actorName: data.driver_name,
        actorRole: "anggota",
        action: "Sinyal SOS Darurat",
        module: "kejadian",
        description: `Memicu sinyal darurat SOS kategori ${data.kategori.replace("_", " ")} di ${data.lokasi_teks}.`,
      });
      toast.success(`Sinyal SOS terkirim! Satgas terdekat telah dinotifikasi. (${data.id})`);
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
      responder,
    }: {
      id: string;
      status: IncidentStatus;
      responder?: string;
    }) => {
      const current = KejadianStorage.getIncidents();
      const updated = current.map((item) => {
        if (item.id !== id) return item;
        const responders =
          responder && !item.responders.includes(responder)
            ? [...item.responders, responder]
            : item.responders;
        return { ...item, status, responders, updated_at: new Date().toISOString() };
      });
      KejadianStorage.saveIncidents(updated);
      return { id, status };
    },
    onSuccess: ({ id, status }) => {
      queryClient.invalidateQueries({ queryKey: ["kejadian"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      enqueueOperation({
        idempotencyKey: `upd-${id}-${Date.now()}`,
        action: "Pembaruan Status SOS",
        module: "kejadian",
        payload: { id, status },
      });
      recordActivityLog({
        actorId: "satgas-onduty",
        actorName: "Satgas Lapangan",
        actorRole: "satgas",
        action: "Pembaruan Status SOS",
        module: "kejadian",
        description: `Mengubah status insiden #${id} menjadi ${status.replace("_", " ")}.`,
      });
      toast.info("Status insiden berhasil diperbarui");
    },
  });

  return {
    incidents: query.data ?? [],
    isLoading: query.isLoading,
    createIncident,
    updateStatus,
  };
}

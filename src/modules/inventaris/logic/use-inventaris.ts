import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { recordActivityLog } from "@/modules/activity-log";
import { enqueueOperation } from "@/core/sync";
import { InventarisStorage } from "../storage/inventaris-storage";
import { InventarisItem } from "../types";

export function useInventaris() {
  const queryClient = useQueryClient();
  const [selectedKategori, setSelectedKategori] = useState("all");

  const query = useQuery({
    queryKey: ["inventaris", "list"],
    queryFn: async (): Promise<InventarisItem[]> => {
      return InventarisStorage.getItems();
    },
  });

  const pinjamItem = useMutation({
    mutationFn: async ({
      id,
      peminjam_nama,
      peminjam_phone,
    }: {
      id: string;
      peminjam_nama: string;
      peminjam_phone: string;
    }) => {
      const current = InventarisStorage.getItems();
      const updated = current.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: "dipinjam" as const,
          peminjam_nama,
          peminjam_phone,
          tgl_pinjam: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
      });
      InventarisStorage.saveItems(updated);
      return { id, peminjam_nama };
    },
    onSuccess: (v) => {
      queryClient.invalidateQueries({ queryKey: ["inventaris"] });
      enqueueOperation({
        idempotencyKey: `inv-borrow-${v.id}-${Date.now()}`,
        action: "Peminjaman Alat Posko",
        module: "inventaris",
        payload: { id: v.id, peminjam: v.peminjam_nama },
      });
      recordActivityLog({
        actorId: "satgas-peminjam",
        actorName: v.peminjam_nama || "Petugas Satgas",
        actorRole: "satgas",
        action: "Peminjaman Alat Posko",
        module: "persetujuan",
        description: `Mencatat peminjaman alat inventaris posko oleh ${v.peminjam_nama}.`,
      });
      toast.success("Peminjaman alat satgas berhasil dicatat");
    },
  });

  const kembalikanItem = useMutation({
    mutationFn: async (id: string) => {
      const current = InventarisStorage.getItems();
      const updated = current.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: "tersedia" as const,
          peminjam_nama: null,
          peminjam_phone: null,
          tgl_pinjam: null,
        };
      });
      InventarisStorage.saveItems(updated);
      return { id };
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["inventaris"] });
      enqueueOperation({
        idempotencyKey: `inv-return-${id}-${Date.now()}`,
        action: "Pengembalian Alat Posko",
        module: "inventaris",
        payload: { id },
      });
      recordActivityLog({
        actorId: "satgas-peminjam",
        actorName: "Petugas Satgas",
        actorRole: "satgas",
        action: "Pengembalian Alat Posko",
        module: "persetujuan",
        description: `Pengembalian alat posko #${id} ke inventaris pangkalan.`,
      });
      toast.success("Alat telah dikembalikan ke pos pantau");
    },
  });

  const allItems = query.data ?? [];
  const filteredItems = allItems.filter((item) => {
    return selectedKategori === "all" || item.kategori === selectedKategori;
  });

  return {
    items: filteredItems,
    totalItems: allItems.length,
    selectedKategori,
    setSelectedKategori,
    isLoading: query.isLoading,
    pinjamItem,
    kembalikanItem,
  };
}

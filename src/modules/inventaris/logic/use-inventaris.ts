import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InventarisStorage } from "../storage/inventaris-storage";
import { InventarisItem } from "../types";
import {
  logInventarisBorrow,
  logInventarisReturn,
  logInventarisNew,
} from "./inventaris-sync-helpers";

export function useInventaris() {
  const queryClient = useQueryClient();
  const [selectedKategori, setSelectedKategori] = useState("all");

  const query = useQuery({
    queryKey: ["inventaris", "list"],
    queryFn: async (): Promise<InventarisItem[]> => InventarisStorage.getItems(),
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
      const updated = current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "dipinjam" as const,
              peminjam_nama,
              peminjam_phone,
              tgl_pinjam: new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            }
          : item,
      );
      InventarisStorage.saveItems(updated);
      return { id, peminjam_nama };
    },
    onSuccess: (v) => {
      queryClient.invalidateQueries({ queryKey: ["inventaris"] });
      logInventarisBorrow(v.id, v.peminjam_nama);
    },
  });

  const kembalikanItem = useMutation({
    mutationFn: async (id: string) => {
      const current = InventarisStorage.getItems();
      const updated = current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "tersedia" as const,
              peminjam_nama: null,
              peminjam_phone: null,
              tgl_pinjam: null,
            }
          : item,
      );
      InventarisStorage.saveItems(updated);
      return { id };
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["inventaris"] });
      logInventarisReturn(id);
    },
  });

  const addItem = useMutation({
    mutationFn: async (newItem: Omit<InventarisItem, "id" | "status">) => {
      const current = InventarisStorage.getItems();
      const item: InventarisItem = {
        ...newItem,
        id: `inv-${Date.now().toString(36)}`,
        status: "tersedia",
      };
      const updated = [item, ...current];
      InventarisStorage.saveItems(updated);
      return item;
    },
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ["inventaris"] });
      logInventarisNew(item);
    },
  });

  const allItems = query.data ?? [];
  const filteredItems = allItems.filter(
    (item) => selectedKategori === "all" || item.kategori === selectedKategori,
  );

  return {
    items: filteredItems,
    totalItems: allItems.length,
    selectedKategori,
    setSelectedKategori,
    isLoading: query.isLoading,
    pinjamItem,
    kembalikanItem,
    addItem,
  };
}

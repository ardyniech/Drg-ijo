import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { BACKUP_STORAGE_KEYS, BackupPayload, hasLocalAppData } from "./system-backup-constants";

export { BACKUP_STORAGE_KEYS, hasLocalAppData };
export type { BackupPayload };

export function useSystemBackup() {
  const qc = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const exportBackup = () => {
    if (typeof window === "undefined") return;
    try {
      const data: Record<string, string> = {};
      let totalRecords = 0;

      for (const key of BACKUP_STORAGE_KEYS) {
        const val = localStorage.getItem(key);
        if (val) {
          data[key] = val;
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) totalRecords += parsed.length;
          } catch {
            totalRecords += 1;
          }
        }
      }

      const backup: BackupPayload = {
        app: "DRG_COMMUNITY_APP",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        recordCount: totalRecords,
        data,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `drg-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Cadangan berhasil diunduh (${totalRecords} catatan data).`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengekspor data cadangan");
    }
  };

  const importBackup = async (file: File): Promise<boolean> => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const parsed: BackupPayload = JSON.parse(text);

      if (parsed.app !== "DRG_COMMUNITY_APP" || !parsed.data) {
        throw new Error("Format berkas cadangan tidak valid untuk DRG App.");
      }

      let restored = 0;
      for (const [key, val] of Object.entries(parsed.data)) {
        if (BACKUP_STORAGE_KEYS.includes(key)) {
          localStorage.setItem(key, val);
          restored += 1;
        }
      }

      qc.invalidateQueries();
      toast.success(`Pemulihan berhasil! (${restored} area data dipulihkan)`);
      setIsProcessing(false);
      return true;
    } catch (err: unknown) {
      setIsProcessing(false);
      toast.error(err instanceof Error ? err.message : "Gagal memulihkan cadangan");
      return false;
    }
  };

  return {
    exportBackup,
    importBackup,
    isProcessing,
  };
}

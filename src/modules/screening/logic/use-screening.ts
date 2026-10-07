import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScreeningApplication, ScreeningStatus, buildScreeningCsv } from "../types";

export function useScreening() {
  const [selected, setSelected] = useState<ScreeningApplication | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<ScreeningStatus | "all">("all");
  const [verifFilter, setVerifFilter] = useState<"all" | "verified" | "unverified">("all");

  const { data = [], isLoading } = useQuery({
    queryKey: ["screening-apps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("screening_applications")
        .select(
          "id, nama, no_hp, email, alamat, kota, motivasi, status, skor_total, catatan_pic, created_at, email_verified",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ScreeningApplication[];
    },
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (verifFilter === "verified" && !c.email_verified) return false;
      if (verifFilter === "unverified" && c.email_verified) return false;
      if (!term) return true;
      return [c.nama, c.no_hp, c.email, c.kota].some((v) => (v ?? "").toLowerCase().includes(term));
    });
  }, [data, q, statusFilter, verifFilter]);

  const exportCsv = () => {
    const csvContent = buildScreeningCsv(filtered);
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `screening-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    data,
    filtered,
    isLoading,
    selected,
    setSelected,
    q,
    setQ,
    statusFilter,
    setStatusFilter,
    verifFilter,
    setVerifFilter,
    exportCsv,
  };
}

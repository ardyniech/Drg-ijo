import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { recordActivityLog } from "@/modules/activity-log";
import { Tx } from "../types";
import { useKasTotals } from "./use-kas-totals";

export function useKas() {
  const qc = useQueryClient();
  const [ledgerFilter, setLedgerFilter] = useState<"all" | "sosial" | "umum">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Tx["status"]>("all");
  const [q, setQ] = useState("");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["kas-tx"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kas_transactions")
        .select("*")
        .order("tanggal", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return data as Tx[];
    },
  });

  const { data: balances = [] } = useQuery({
    queryKey: ["kas-balances"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("kas_balances");
      if (error) throw error;
      return (data ?? []) as Array<Record<string, unknown>>;
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("kas-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "kas_transactions" }, () => {
        qc.invalidateQueries({ queryKey: ["kas-tx"] });
        qc.invalidateQueries({ queryKey: ["kas-balances"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (ledgerFilter !== "all" && r.ledger !== ledgerFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (term) {
        const hay = `${r.kategori ?? ""} ${r.deskripsi ?? ""}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [rows, ledgerFilter, statusFilter, q]);

  const totals = useKasTotals(balances);

  const approve = useMutation({
    mutationFn: async ({
      id,
      status,
      note,
    }: {
      id: string;
      status: "disetujui" | "ditolak";
      note?: string;
    }) => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("kas_transactions")
        .update({
          status,
          approved_by: u.user?.id ?? null,
          approved_at: new Date().toISOString(),
          catatan_approver: note?.trim() || null,
        })
        .eq("id", id);
      if (error) throw error;
      return { id, status, userId: u.user?.id };
    },
    onSuccess: (_d, v) => {
      toast.success(v.status === "disetujui" ? "Transaksi disetujui" : "Transaksi ditolak");
      recordActivityLog({
        actorId: v.userId || "bendahara",
        actorName: "Bendahara Keuangan",
        actorRole: "bendahara",
        action: v.status === "disetujui" ? "Persetujuan Transaksi Kas" : "Penolakan Transaksi Kas",
        module: "kas",
        description: `${v.status === "disetujui" ? "Menyetujui" : "Menolak"} transaksi kas #${v.id.slice(-4)}.`,
      });
      qc.invalidateQueries({ queryKey: ["kas-tx"] });
      qc.invalidateQueries({ queryKey: ["kas-balances"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return {
    rows,
    filtered,
    totals,
    isLoading,
    ledgerFilter,
    setLedgerFilter,
    statusFilter,
    setStatusFilter,
    q,
    setQ,
    approve,
  };
}

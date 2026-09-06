import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tx } from "../types";

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
      return data ?? [];
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

  const totals = useMemo(() => {
    const acc = { sosial: 0, umum: 0, menunggu: 0 };
    balances.forEach((b) => {
      acc[b.ledger as "sosial" | "umum"] = Number(b.saldo ?? 0);
      acc.menunggu += Number(b.menunggu ?? 0);
    });
    return acc;
  }, [balances]);

  const approve = useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: "disetujui" | "ditolak"; note?: string }) => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("kas_transactions")
        .update({
          status,
          approved_by: u.user?.id ?? null,
          approved_at: new Date().toISOString(),
          catatan_approver: note ?? null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      toast.success(v.status === "disetujui" ? "Disetujui" : "Ditolak");
      qc.invalidateQueries({ queryKey: ["kas-balances"] });
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

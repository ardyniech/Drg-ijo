import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { recordActivityLog } from "@/modules/activity-log";
import { Shift, Swap, addDays, startOfWeek, toIso } from "../types";

export function usePiket(userId?: string) {
  const qc = useQueryClient();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );
  const fromIso = toIso(days[0]);
  const toIsoEnd = toIso(days[6]);

  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ["piket", fromIso, toIsoEnd],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("piket_shifts")
        .select("*")
        .gte("tanggal", fromIso)
        .lte("tanggal", toIsoEnd);
      if (error) throw error;
      return data as Shift[];
    },
  });

  const { data: profileMap = {} } = useQuery({
    queryKey: ["piket-profiles", shifts.map((s) => s.user_id).join(",")],
    enabled: shifts.length > 0,
    queryFn: async () => {
      const ids = [...new Set(shifts.map((s) => s.user_id).filter(Boolean))] as string[];
      if (!ids.length) return {};
      const { data } = await supabase.from("profiles").select("id, nama").in("id", ids);
      const m: Record<string, string> = {};
      (data ?? []).forEach((p) => {
        m[p.id] = p.nama ?? "";
      });
      return m;
    },
  });

  const { data: mySwaps = [] } = useQuery({
    queryKey: ["piket-swaps", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("piket_swap_requests")
        .select("*")
        .or(`requested_by.eq.${userId},target_user_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .limit(20);
      return (data ?? []) as Swap[];
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("piket-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "piket_shifts" }, () =>
        qc.invalidateQueries({ queryKey: ["piket"] }),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "piket_swap_requests" }, () =>
        qc.invalidateQueries({ queryKey: ["piket-swaps"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const respondSwap = useMutation({
    mutationFn: async ({
      id,
      accept,
      shiftId,
    }: {
      id: string;
      accept: boolean;
      shiftId: string;
      requestedBy: string;
    }) => {
      const status = accept ? "diterima" : "ditolak";
      const { error } = await supabase
        .from("piket_swap_requests")
        .update({ status, responded_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      if (accept && userId) {
        await supabase.from("piket_shifts").update({ user_id: userId }).eq("id", shiftId);
      }
    },
    onSuccess: () => {
      toast.success("Permintaan diperbarui");
      recordActivityLog({
        actorId: userId || "korlap",
        actorName: "Korlap Satgas",
        actorRole: "korlap",
        action: "Persetujuan Tukar Shift",
        module: "piket",
        description: "Memproses permohonan penukaran shift piket posko wilayah.",
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return {
    weekStart,
    setWeekStart,
    days,
    fromIso,
    shifts,
    isLoading,
    profileMap,
    mySwaps,
    respondSwap,
    refetch: () => qc.invalidateQueries({ queryKey: ["piket"] }),
  };
}

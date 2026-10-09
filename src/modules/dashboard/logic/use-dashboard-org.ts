import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useKasTotals } from "@/modules/kas/logic/use-kas-totals";
import { Tx } from "@/modules/kas/types";

export interface DashboardOrgRow {
  id: string;
  nama: string | null;
  role: string | null;
  status: string | null;
  pangkalan: string | null;
  jenjang: string | null;
}

const PENGURUS_ROLES = new Set(["ketua", "sekretaris", "bendahara", "admin", "super_admin"]);
const SATGAS_ROLES = new Set(["korlap", "satgas"]);

export function useDashboardOrg() {
  const { data: members = [] } = useQuery({
    queryKey: ["dashboard-org"],
    queryFn: async (): Promise<DashboardOrgRow[]> => {
      const { data } = await supabase
        .from("profiles")
        .select("id, nama, role, status, pangkalan, jenjang");
      return (data ?? []) as DashboardOrgRow[];
    },
  });

  const { data: rows = [] } = useQuery({
    queryKey: ["kas-tx"],
    queryFn: async (): Promise<Tx[]> => {
      const { data } = await supabase.from("kas_transactions").select("*");
      return (data ?? []) as Tx[];
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

  const kas = useKasTotals(balances);

  const disetujui = rows.filter((t) => t.status === "disetujui");
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const masukBulanIni = disetujui
    .filter((t) => t.jenis === "masuk" && t.tanggal >= monthStart)
    .reduce((acc, t) => acc + Number(t.jumlah), 0);

  const pangkalanSet = new Set(
    members.map((m) => m.pangkalan).filter((p): p is string => Boolean(p)),
  );

  return {
    members,
    activeCount: members.filter((m) => m.status === "aktif").length,
    pendingCount: members.filter((m) => m.status === "pending_review").length,
    pengurusCount: members.filter((m) => PENGURUS_ROLES.has(m.role ?? "")).length,
    satgasCount: members.filter((m) => SATGAS_ROLES.has(m.role ?? "")).length,
    pangkalanCount: pangkalanSet.size,
    pangkalanList: [...pangkalanSet],
    roleCount: new Set(members.map((m) => m.role).filter(Boolean)).size,
    saldo: kas.sosial + kas.umum,
    saldoSosial: kas.sosial,
    menungguKas: kas.menunggu,
    masukBulanIni,
    txCount: rows.length,
    txApproved: disetujui.length,
    approvedPct: rows.length ? Math.round((disetujui.length / rows.length) * 100) : null,
  };
}

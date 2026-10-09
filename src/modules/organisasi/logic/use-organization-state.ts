import { useState, useMemo } from "react";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { KasSkStorage } from "@/modules/kas/storage/kas-sk-storage";
import { getRoleAuditLogs } from "@/modules/roles/storage/roles-storage";
import { getActivityLogs } from "@/modules/activity-log";
import { MemberManagementService } from "@/modules/anggota/storage/member-management-service";
import { MemberRecord } from "@/modules/anggota/types";
import { KasSkRecord } from "@/modules/kas/types";
import { ActivityLogEntry } from "@/modules/activity-log/types";
import { OrgTab, OrgRoleSummary } from "../types";
import { toast } from "sonner";

export function useOrganizationState() {
  const [activeTab, setActiveTab] = useState<OrgTab>("members");
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const rawUsers = useMemo(() => (refreshKey < 0 ? [] : LocalAuthClient.getUsers()), [refreshKey]);
  const skKas = useMemo(() => (refreshKey < 0 ? [] : KasSkStorage.getAll()), [refreshKey]);
  const roleAuditLogs = useMemo(() => (refreshKey < 0 ? [] : getRoleAuditLogs()), [refreshKey]);
  const allLogs: ActivityLogEntry[] = useMemo(
    () => (refreshKey < 0 ? [] : getActivityLogs()),
    [refreshKey],
  );

  const members: MemberRecord[] = useMemo(() => {
    return rawUsers.map((u) => ({
      id: u.id,
      nama: u.nama,
      no_kta: u.nomor_anggota || `DRG-${u.id.slice(-3)}`,
      no_hp: u.no_hp || "-",
      pangkalan: u.pangkalan || "Pangkalan Umum",
      role: u.role,
      jenjang: u.jenjang,
      status: u.status,
      bergabung_sejak: u.created_at ? u.created_at.split("T")[0] : "2026-01-01",
      plat_nomor: u.plat_nomor || "-",
      jenis_kendaraan: u.jenis_kendaraan || "Sepeda Motor",
    }));
  }, [rawUsers]);

  const roles: OrgRoleSummary[] = useMemo(() => {
    const roleDefs = [
      { role: "ketua", label: "Ketua Umum" },
      { role: "sekretaris", label: "Sekretaris Jenderal" },
      { role: "bendahara", label: "Bendahara Umum" },
      { role: "satgas", label: "Satgas Siaga Lapangan" },
      { role: "dewan_etik", label: "Dewan Etik Jalur" },
      { role: "korlap", label: "Koordinator Lapangan" },
      { role: "anggota", label: "Driver Anggota" },
    ];
    return roleDefs.map((def) => {
      const match = members.filter((m) => m.role === def.role);
      const assign = roleAuditLogs.find((a) => a.toRole === def.role);
      return {
        role: def.role,
        label: def.label,
        count: match.length,
        sk_mandat: assign?.skNumber || "SK-MDT/DRG/2026/001",
        pejabat: match.map((m) => m.nama).join(", ") || "Belum Ditugaskan",
      };
    });
  }, [members, roleAuditLogs]);

  const q = search.toLowerCase();
  const filteredMembers = useMemo(
    () =>
      !q
        ? members
        : members.filter(
            (m) => m.nama.toLowerCase().includes(q) || m.pangkalan.toLowerCase().includes(q),
          ),
    [members, q],
  );

  const filteredSkKas = useMemo(
    () =>
      !q
        ? skKas
        : skKas.filter(
            (s) => s.judul.toLowerCase().includes(q) || s.penerima_nama.toLowerCase().includes(q),
          ),
    [skKas, q],
  );

  const filteredLogs = useMemo(
    () =>
      !q
        ? allLogs
        : allLogs.filter(
            (l) => l.action.toLowerCase().includes(q) || l.description.toLowerCase().includes(q),
          ),
    [allLogs, q],
  );

  const cairkanSk = (id: string) => {
    const updated = KasSkStorage.updateStatus(id, "dicairkan");
    if (updated) {
      toast.success(`Dana SK ${updated.no_sk} resmi dicairkan ke penerima`);
      setRefreshKey((k) => k + 1);
    }
  };

  const updateMemberStatus = (memberId: string, newStatus: MemberRecord["status"]) => {
    MemberManagementService.updateMember(memberId, { status: newStatus }, "admin");
    toast.success(`Status anggota berhasil diperbarui menjadi ${newStatus}`);
    setRefreshKey((k) => k + 1);
  };

  return {
    members: filteredMembers,
    roles,
    skKas: filteredSkKas,
    auditLogs: filteredLogs,
    totalMembers: members.length,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    cairkanSk,
    updateMemberStatus,
  };
}

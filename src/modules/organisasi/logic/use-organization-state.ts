import { useState, useMemo } from "react";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { KasSkStorage } from "@/modules/kas/storage/kas-sk-storage";
import { getMemberRoleRecords, getRoleAuditLogs } from "@/modules/roles/storage/roles-storage";
import { MemberRecord } from "@/modules/anggota/types";
import { KasSkRecord } from "@/modules/kas/types";
import { OrgTab, OrgRoleSummary } from "../types";
import { toast } from "sonner";

export function useOrganizationState() {
  const [activeTab, setActiveTab] = useState<OrgTab>("members");
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const rawUsers = useMemo(() => {
    if (refreshKey < 0) return [];
    return LocalAuthClient.getUsers();
  }, [refreshKey]);

  const skKas = useMemo(() => {
    if (refreshKey < 0) return [];
    return KasSkStorage.getAll();
  }, [refreshKey]);

  const roleAuditLogs = useMemo(() => {
    if (refreshKey < 0) return [];
    return getRoleAuditLogs();
  }, [refreshKey]);

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
    const roleDefs: Array<{ role: string; label: string }> = [
      { role: "ketua", label: "Ketua Umum" },
      { role: "sekretaris", label: "Sekretaris Jenderal" },
      { role: "bendahara", label: "Bendahara Umum" },
      { role: "satgas", label: "Satgas Siaga Lapangan" },
      { role: "dewan_etik", label: "Dewan Etik Jalur" },
      { role: "korlap", label: "Koordinator Lapangan" },
      { role: "anggota", label: "Driver Anggota" },
    ];

    return roleDefs.map((def) => {
      const matchMembers = members.filter((m) => m.role === def.role);
      const assignment = roleAuditLogs.find((a) => a.toRole === def.role);
      return {
        role: def.role,
        label: def.label,
        count: matchMembers.length,
        sk_mandat: assignment?.skNumber || "SK-MDT/DRG/2026/001",
        pejabat: matchMembers.map((m) => m.nama).join(", ") || "Belum Ditugaskan",
      };
    });
  }, [members, roleAuditLogs]);

  const filteredMembers = useMemo(() => {
    if (!search) return members;
    const q = search.toLowerCase();
    return members.filter(
      (m) => m.nama.toLowerCase().includes(q) || m.pangkalan.toLowerCase().includes(q),
    );
  }, [members, search]);

  const filteredSkKas = useMemo(() => {
    if (!search) return skKas;
    const q = search.toLowerCase();
    return skKas.filter(
      (s) => s.judul.toLowerCase().includes(q) || s.penerima_nama.toLowerCase().includes(q),
    );
  }, [skKas, search]);

  const cairkanSk = (id: string) => {
    const updated = KasSkStorage.updateStatus(id, "dicairkan");
    if (updated) {
      toast.success(`Dana SK ${updated.no_sk} resmi dicairkan ke penerima`);
      setRefreshKey((k) => k + 1);
    }
  };

  return {
    members: filteredMembers,
    roles,
    skKas: filteredSkKas,
    totalMembers: members.length,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    cairkanSk,
  };
}

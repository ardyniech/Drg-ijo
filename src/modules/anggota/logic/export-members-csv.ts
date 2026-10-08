import { MemberRecord } from "../types";

function escapeCsvField(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export function exportMembersToCsv(members: MemberRecord[], filenamePrefix = "anggota-drg"): void {
  const headers = [
    "No KTA",
    "Nama Lengkap",
    "Status",
    "Peran Komunitas",
    "Jenjang Kader",
    "Pangkalan",
    "No Handphone",
    "Plat Nomor",
    "Jenis Kendaraan",
    "Tanggal Bergabung",
  ];

  const rows = members.map((m) => [
    m.no_kta,
    m.nama,
    m.status === "aktif"
      ? "Verified (Aktif)"
      : m.status === "pending_review"
        ? "Pending Review"
        : "Nonaktif",
    m.role.replace("_", " "),
    m.jenjang,
    m.pangkalan,
    m.no_hp || "-",
    m.plat_nomor || "-",
    m.jenis_kendaraan || "-",
    m.bergabung_sejak || "-",
  ]);

  const csvContent =
    "\uFEFF" +
    [headers.map(escapeCsvField).join(",")]
      .concat(rows.map((row) => row.map(escapeCsvField).join(",")))
      .join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filenamePrefix}-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

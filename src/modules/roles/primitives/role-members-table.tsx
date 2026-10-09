import { MemberRoleRecord } from "../types";
import { AVAILABLE_ROLES } from "../constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOjolJenjang } from "@/lib/ojol-jenjang";
import { ShieldAlert, UserCog } from "lucide-react";

interface Props {
  members: MemberRoleRecord[];
  onSelectMember: (member: MemberRoleRecord) => void;
  canEdit: boolean;
}

export function RoleMembersTable({ members, onSelectMember, canEdit }: Props) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <ShieldAlert className="h-10 w-10 text-muted-foreground/60" />
        <h3 className="mt-3 text-sm font-semibold text-foreground">Tidak Ditemukan Anggota</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Coba sesuaikan kata kunci pencarian atau filter kategori pengurus.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nama & Kontak</th>
              <th className="px-4 py-3">Pangkalan</th>
              <th className="px-4 py-3">Peran Organisasi</th>
              <th className="px-4 py-3">Tingkat Aspal</th>
              <th className="px-4 py-3 text-right">Aksi Mandat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m) => {
              const roleDef = AVAILABLE_ROLES.find((r) => r.id === m.role) || AVAILABLE_ROLES[7];
              return (
                <tr key={m.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-foreground">{m.nama}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{m.email}</div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {m.pangkalan || "Belum diatur"}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge
                      variant="outline"
                      className={`font-semibold text-[11px] ${roleDef?.badgeClass}`}
                    >
                      {roleDef?.name}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-muted-foreground">
                      {getOjolJenjang(m.jenjang).title}
                      <span className="ml-1 text-[11px]">
                        ({getOjolJenjang(m.jenjang).nickname})
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!canEdit}
                      title={
                        !canEdit
                          ? "Hanya Ketua, Sekretaris, atau Admin yang berhak mengubah peran"
                          : "Ubah peran jabatan pengurus"
                      }
                      onClick={() => onSelectMember(m)}
                      className="h-8 gap-1.5 rounded-xl text-xs"
                    >
                      <UserCog className="h-3.5 w-3.5" />
                      Ubah Peran
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

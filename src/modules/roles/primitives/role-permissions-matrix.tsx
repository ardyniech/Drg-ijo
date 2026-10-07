import { AVAILABLE_ROLES, PERMISSIONS_LIST } from "../constants";
import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RolePermissionsMatrix() {
  const displayRoles = AVAILABLE_ROLES.filter((r) => r.id !== "super_admin");

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="p-4 border-b border-border bg-muted/20">
        <h3 className="text-sm font-bold text-foreground">Matriks Hak Akses & Kewenangan Peran</h3>
        <p className="text-xs text-muted-foreground">
          Daftar kewenangan operasional, legalitas SK, dan approval keuangan tiap jabatan DRG
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
            <tr>
              <th className="px-4 py-3 min-w-[200px]">Modul & Kewenangan</th>
              {displayRoles.map((role) => (
                <th key={role.id} className="px-3 py-3 text-center min-w-[100px]">
                  <Badge variant="outline" className={`text-[10px] ${role.badgeClass}`}>
                    {role.name}
                  </Badge>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PERMISSIONS_LIST.map((perm) => (
              <tr key={perm.id} className="hover:bg-muted/15 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">{perm.name}</div>
                  <div className="text-[11px] text-muted-foreground">{perm.description}</div>
                </td>
                {displayRoles.map((role) => {
                  const hasPerm = role.permissions.includes(perm.id);
                  return (
                    <td key={role.id} className="px-3 py-3 text-center">
                      {hasPerm ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-success">
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </span>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center text-muted-foreground/40">
                          <Minus className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

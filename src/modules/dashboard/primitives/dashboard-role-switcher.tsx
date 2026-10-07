import { UserRole } from "@/hooks/use-me";
import { Badge } from "@/components/ui/badge";
import { Shield, Sparkles } from "lucide-react";

interface Props {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const ROLES_LIST: { id: UserRole; label: string; bg: string }[] = [
  { id: "ketua", label: "Ketua Umum", bg: "hover:bg-amber-500/10 text-amber-600" },
  { id: "sekretaris", label: "Sekretaris", bg: "hover:bg-blue-500/10 text-blue-600" },
  { id: "bendahara", label: "Bendahara", bg: "hover:bg-emerald-500/10 text-emerald-600" },
  { id: "admin", label: "Admin Sistem", bg: "hover:bg-purple-500/10 text-purple-600" },
  { id: "korlap", label: "Korlap Satgas", bg: "hover:bg-orange-500/10 text-orange-600" },
  { id: "satgas", label: "Satgas Lapangan", bg: "hover:bg-rose-500/10 text-rose-600" },
  { id: "dewan_etik", label: "Dewan Etik", bg: "hover:bg-indigo-500/10 text-indigo-600" },
  { id: "anggota", label: "Driver / Anggota", bg: "hover:bg-primary/10 text-primary" },
];

export function DashboardRoleSwitcher({ activeRole, onRoleChange }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card/90 p-3 shadow-xs backdrop-blur-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Pratinjau Dashboard Spesifik Peran (Simulasi Live):</span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] gap-1 font-mono uppercase bg-primary/5 text-primary"
        >
          <Shield className="h-3 w-3" /> Role: {activeRole}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {ROLES_LIST.map((r) => {
          const isActive = activeRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onRoleChange(r.id)}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all select-none ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-2xs scale-105"
                  : `border-border bg-muted/30 text-muted-foreground ${r.bg}`
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

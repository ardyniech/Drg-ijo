import { OrgRoleSummary } from "../types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function OrgRolesGrid({ roles }: { roles: OrgRoleSummary[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((r) => (
        <Card key={r.role} className="border-border/70 shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" /> {r.label}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {r.count} Personel
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">SK: {r.sk_mandat}</p>
            <div className="border-t border-border/50 pt-2 text-[11px]">
              <span className="text-muted-foreground">Amanah Diberikan ke:</span>
              <p className="font-semibold text-foreground truncate mt-0.5">{r.pejabat}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

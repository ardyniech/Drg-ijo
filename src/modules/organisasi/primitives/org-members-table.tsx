import { MemberRecord } from "@/modules/anggota/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function OrgMembersTable({ members }: { members: MemberRecord[] }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Nama & KTA</TableHead>
            <TableHead>Pangkalan</TableHead>
            <TableHead>Amanah Peran</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                <p className="font-semibold text-xs text-foreground">{m.nama}</p>
                <p className="text-[10px] font-mono text-muted-foreground">{m.no_kta}</p>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{m.pangkalan}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  {m.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={`text-[10px] ${m.status === "aktif" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}
                >
                  {m.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { MemberRecord } from "@/modules/anggota/types";
import { KasSkRecord, rupiah } from "@/modules/kas";
import { OrgTab, OrgRoleSummary } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Shield, HeartHandshake } from "lucide-react";

interface OrgRecordsViewProps {
  activeTab: OrgTab;
  members: MemberRecord[];
  roles: OrgRoleSummary[];
  skKas: KasSkRecord[];
  onCairkanSk: (id: string) => void;
}

export function OrgRecordsView({
  activeTab,
  members,
  roles,
  skKas,
  onCairkanSk,
}: OrgRecordsViewProps) {
  if (activeTab === "roles") {
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

  if (activeTab === "sk_kas") {
    return (
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nomor SK & Tanggal</TableHead>
              <TableHead>Peruntukan Santunan</TableHead>
              <TableHead>Penerima</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skKas.map((sk) => (
              <TableRow key={sk.id}>
                <TableCell>
                  <p className="font-mono text-xs font-semibold text-foreground">{sk.no_sk}</p>
                  <p className="text-[10px] text-muted-foreground">{sk.tanggal}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-xs text-foreground">{sk.judul}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {sk.kategori.replace("_", " ")}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-xs text-foreground">{sk.penerima_nama}</p>
                  <p className="text-[10px] text-muted-foreground">{sk.penerima_pangkalan}</p>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    {rupiah(sk.nominal)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${sk.status === "dicairkan" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}
                  >
                    {sk.status === "dicairkan" ? "Dicairkan" : "Disahkan"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {sk.status !== "dicairkan" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCairkanSk(sk.id)}
                      className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Cairkan
                    </Button>
                  ) : (
                    <span className="text-[11px] text-muted-foreground font-mono">Tersalurkan</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

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

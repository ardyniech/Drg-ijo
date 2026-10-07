import { RotateCcw, MapPin, Radio, Shield, HeartPulse, Wrench } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventarisItem } from "../types";
import { PinjamDialog } from "./pinjam-dialog";
import { useInventaris } from "../logic/use-inventaris";

const ICONS = {
  Komunikasi: Radio,
  Keselamatan: Shield,
  P3K: HeartPulse,
  "Perlengkapan Pos": Wrench,
};

export function InventarisTable({ items }: { items: InventarisItem[] }) {
  const { kembalikanItem } = useInventaris();

  return (
    <div className="rounded-md border border-border/80 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Kode / Nama Barang</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Pos Simpan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const Icon = ICONS[item.kategori] || Wrench;
            const isBorrowed = item.status === "dipinjam";

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-foreground">{item.nama_barang}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        {item.kode_alat} • Kondisi: {item.kondisi}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {item.kategori}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    <span className="truncate">{item.lokasi_pos}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {isBorrowed ? (
                    <div>
                      <Badge
                        variant="secondary"
                        className="bg-amber-500/15 text-amber-700 text-[10px]"
                      >
                        Dipinjam
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.peminjam_nama}
                      </p>
                    </div>
                  ) : (
                    <Badge className="bg-emerald-500/15 text-emerald-700 text-[10px]">
                      Tersedia
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isBorrowed ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => kembalikanItem.mutate(item.id)}
                      className="h-7 text-xs text-primary"
                    >
                      <RotateCcw className="mr-1 h-3 w-3" /> Kembalikan
                    </Button>
                  ) : (
                    <PinjamDialog item={item} />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

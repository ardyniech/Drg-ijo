import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { InventarisTable, useInventaris, NewItemDialog } from "@/modules/inventaris";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Boxes, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/inventaris")({
  component: InventarisPage,
});

function InventarisPage() {
  const { items, totalItems, selectedKategori, setSelectedKategori, isLoading } = useInventaris();

  return (
    <PageShell
      title="Inventaris & Perlengkapan Basecamp"
      description={`Peralatan gotong royong dulur (${totalItems} unit tercatat): HT pantau jalur, rompi satgas, kotak P3K medis, dan perkakas pangkalan.`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedKategori} onValueChange={setSelectedKategori}>
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Komunikasi">Komunikasi Jalur (HT)</SelectItem>
              <SelectItem value="Keselamatan">Rompi & Helm Satgas</SelectItem>
              <SelectItem value="P3K">Kotak P3K Medis</SelectItem>
              <SelectItem value="Perlengkapan Pos">Perlengkapan Basecamp</SelectItem>
            </SelectContent>
          </Select>
          <NewItemDialog />
        </div>
      }
    >
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat daftar inventaris...</p>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center text-muted-foreground">
            <Boxes className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium text-foreground">
              Tidak ada barang inventaris pada kategori ini.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedKategori("all")}
              className="mt-4 gap-1.5 rounded-xl text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Tampilkan Semua Kategori
            </Button>
          </div>
        ) : (
          <InventarisTable items={items} />
        )}
      </div>
    </PageShell>
  );
}

import { useRef, useState } from "react";
import { Download, Upload, ShieldCheck, Database, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useSystemBackup } from "../logic/use-system-backup";

export function BackupRestoreCard() {
  const { exportBackup, importBackup, isProcessing } = useSystemBackup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    await importBackup(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedFileName(null);
  };

  return (
    <Card className="rounded-2xl border border-border/80 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">
              Cadangan & Pemulihan Data Organisasi
            </CardTitle>
            <CardDescription className="text-xs">
              Simpan dan pulihkan seluruh data anggota, kas, piket, dan notulen untuk perlindungan
              data lokal.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Portabilitas Penuh & Enkripsi Data Perangkat</span>
          </div>
          <p>
            Mengekspor berkas JSON cadangan yang aman disimpan ke Google Drive atau komputer. Saat
            berpindah gawai HP, cukup unggah berkas ini untuk memulihkan seluruh aktivitas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={exportBackup}
            disabled={isProcessing}
            className="gap-2 rounded-xl text-xs font-medium"
          >
            <Download className="h-3.5 w-3.5 text-primary" />
            Unduh Cadangan (Backup JSON)
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="gap-2 rounded-xl text-xs font-medium"
          >
            {isProcessing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {selectedFileName
              ? `Memproses ${selectedFileName}...`
              : "Pulihkan dari Berkas (Restore)"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

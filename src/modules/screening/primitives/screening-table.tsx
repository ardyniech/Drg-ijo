import { Badge } from "@/components/ui/badge";
import { ClipboardList, Loader2, MailCheck, MailWarning } from "lucide-react";
import { ScreeningApplication, statusStyle } from "../types";

interface Props {
  data: ScreeningApplication[];
  isLoading: boolean;
  onSelect: (app: ScreeningApplication) => void;
}

export function ScreeningTable({ data, isLoading, onSelect }: Props) {
  if (isLoading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        Tidak ada aplikasi cocok dengan filter.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Calon</th>
            <th className="px-4 py-3">Kontak</th>
            <th className="px-4 py-3">Kota</th>
            <th className="px-4 py-3">Tgl. Submit</th>
            <th className="px-4 py-3">Skor</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((c) => (
            <tr key={c.id} className="cursor-pointer hover:bg-muted/40" onClick={() => onSelect(c)}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  <span className="font-medium">{c.nama}</span>
                  {c.email_verified ? (
                    <MailCheck
                      className="h-3.5 w-3.5 text-success"
                      aria-label="Email terverifikasi"
                    />
                  ) : (
                    <MailWarning className="h-3.5 w-3.5 text-warn" aria-label="Belum verifikasi" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.no_hp}</td>
              <td className="px-4 py-3 text-muted-foreground">{c.kota ?? "—"}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {new Date(c.created_at).toLocaleDateString("id-ID")}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
                  {c.skor_total ?? 0}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={statusStyle[c.status]}>
                  {c.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

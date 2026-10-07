import { ApprovalItem } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, MapPin, Phone, Car, CheckCircle2, XCircle } from "lucide-react";

interface ApprovalCardProps {
  item: ApprovalItem;
  onReview: (item: ApprovalItem) => void;
}

export function ApprovalCard({ item, onReview }: ApprovalCardProps) {
  const typeLabel = {
    registrasi_baru: "Registrasi Anggota Baru",
    mutasi_pangkalan: "Mutasi Pangkalan",
    perubahan_role: "Kenaikan Role / Jabatan",
  }[item.type];

  const statusBadge = {
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    rejected: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  }[item.status];

  return (
    <Card className="rounded-2xl border border-border/70 shadow-warm transition-all hover:border-primary/40">
      <CardContent className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-sm font-bold text-foreground">
                  {item.applicantName}
                </h3>
                <Badge variant="outline" className={`px-2 py-0.5 text-[10px] ${statusBadge}`}>
                  {item.status === "pending"
                    ? "Menunggu Verifikasi"
                    : item.status === "approved"
                      ? "Disetujui"
                      : "Ditolak"}
                </Badge>
              </div>
              <p className="text-xs font-semibold text-primary mt-0.5">{typeLabel}</p>
            </div>
          </div>

          {item.status === "pending" ? (
            <Button
              size="sm"
              onClick={() => onReview(item)}
              className="self-end sm:self-auto gap-1.5 rounded-xl text-xs font-semibold"
            >
              Verifikasi Dokumen
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground self-end sm:self-auto">
              Oleh: {item.reviewedBy || "Admin"}
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground sm:grid-cols-3">
          <div className="flex items-center gap-1.5">
            <Car className="h-3.5 w-3.5 text-foreground" />
            <span>
              Plat: <strong className="text-foreground">{item.plateNumber}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-foreground" />
            <span>{item.applicantPhone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-foreground" />
            <span>
              Target: <strong className="text-foreground">{item.appliedBase}</strong>
            </span>
          </div>
        </div>

        {item.reviewNotes && (
          <div className="mt-2.5 text-xs text-muted-foreground italic">
            Catatan: "{item.reviewNotes}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}

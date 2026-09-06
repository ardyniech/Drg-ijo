import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Copy, MailCheck, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { DaftarDoneState } from "../types";

interface Props {
  done: DaftarDoneState;
}

export function DaftarSuccessView({ done }: Props) {
  const verifyUrl = `${window.location.origin}/verifikasi/${done.token}`;
  const statusUrl = `${window.location.origin}/status/${done.token}`;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
        <MailCheck className="h-8 w-8" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold">Pendaftaran Diterima</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Data calon anggota tersimpan aman di server lokal DRG. Konfirmasi email{" "}
        <strong className="text-foreground">{done.email}</strong> untuk verifikasi instan.
      </p>
      <div className="mt-6 w-full space-y-3 rounded-2xl border border-border bg-card p-4 text-left shadow-card">
        <div>
          <div className="text-xs font-semibold uppercase text-muted-foreground">Tautan Verifikasi</div>
          <div className="mt-1 flex gap-2">
            <Input readOnly value={verifyUrl} className="font-mono text-xs" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(verifyUrl);
                toast.success("Tersalin ke clipboard");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-muted-foreground">Cek Status Kapan Pun</div>
          <div className="mt-1 flex gap-2">
            <Input readOnly value={statusUrl} className="font-mono text-xs" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(statusUrl);
                toast.success("Tersalin ke clipboard");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/verifikasi/$token" params={{ token: done.token }}>
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> Verifikasi Sekarang
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/status/$token" params={{ token: done.token }}>
            Lihat Status
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/auth">
            <Shield className="mr-1.5 h-4 w-4" /> Halaman Masuk
          </Link>
        </Button>
      </div>
    </div>
  );
}

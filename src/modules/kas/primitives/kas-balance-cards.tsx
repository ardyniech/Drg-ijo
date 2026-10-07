import { rupiah } from "../types";

interface Props {
  totals: {
    sosial: number;
    umum: number;
    menunggu: number;
  };
}

export function KasBalanceCards({ totals }: Props) {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-success/30 bg-success/5 p-5 shadow-card">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Saldo Sosial
        </div>
        <div className="mt-2 text-3xl font-bold text-success">{rupiah(totals.sosial)}</div>
        <div className="mt-1 text-xs text-muted-foreground">Saldo dari transaksi disetujui.</div>
      </div>

      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-card">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Saldo Koperasi
        </div>
        <div className="mt-2 text-3xl font-bold text-primary">{rupiah(totals.umum)}</div>
        <div className="mt-1 text-xs text-muted-foreground">Saldo dari transaksi disetujui.</div>
      </div>

      <div className="rounded-2xl border border-warn/40 bg-warn/10 p-5 shadow-card">
        <div className="text-xs font-semibold uppercase tracking-wider text-warn-foreground/80">
          Menunggu approval
        </div>
        <div className="mt-2 text-3xl font-bold text-warn-foreground">{totals.menunggu}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Transaksi bernilai besar butuh review.
        </div>
      </div>
    </div>
  );
}

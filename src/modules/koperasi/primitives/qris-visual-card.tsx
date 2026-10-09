import { QrCode } from "lucide-react";

export function QrisVisualCard({ refCode }: { refCode: string }) {
  return (
    <div className="mx-auto max-w-[220px] rounded-2xl border-2 border-foreground/10 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between border-b pb-1 text-[10px] font-bold text-slate-800">
        <span>QRIS</span>
        <span className="text-[9px] text-slate-500">GPN</span>
      </div>
      <div className="aspect-square w-full rounded-lg bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
        <QrCode className="h-32 w-32 text-slate-900" />
      </div>
      <p className="mt-2 text-[10px] font-bold text-slate-800">KAS SEDULUR DRG MALANG</p>
      <p className="font-mono text-[9px] text-slate-500">{refCode}</p>
    </div>
  );
}

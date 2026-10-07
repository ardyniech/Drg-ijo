import { rupiah } from "../types";

interface Props {
  active?: boolean;
  payload?: Array<{ value?: unknown }>;
  label?: string;
}

export function KasTrendTooltip({ active, payload, label }: Props) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-lg text-xs space-y-1 font-mono">
      <p className="font-sans font-bold text-popover-foreground mb-1">{label}</p>
      <p className="text-emerald-600">
        Dana Sosial: <span className="font-semibold">{rupiah(Number(payload[0]?.value))}</span>
      </p>
      <p className="text-blue-600">
        Kas Koperasi: <span className="font-semibold">{rupiah(Number(payload[1]?.value))}</span>
      </p>
    </div>
  );
}

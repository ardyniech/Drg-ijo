import { Bike, Shield, Flame, Crown } from "lucide-react";
import { OJOL_JENJANG_REGISTRY } from "@/lib/ojol-jenjang";

interface Props {
  levelFilter: string;
  setLevelFilter: (v: string) => void;
}

export function KaderisasiTierGuide({ levelFilter, setLevelFilter }: Props) {
  const stages = [
    { ...OJOL_JENJANG_REGISTRY.calon, icon: Bike, step: "1" },
    { ...OJOL_JENJANG_REGISTRY.muda, icon: Shield, step: "2" },
    { ...OJOL_JENJANG_REGISTRY.madya, icon: Flame, step: "3" },
    { ...OJOL_JENJANG_REGISTRY.purna, icon: Crown, step: "4" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stages.map((stage) => {
        const Icon = stage.icon;
        const isSelected = levelFilter === stage.kaderisasiLevel;
        return (
          <div
            key={stage.key}
            onClick={() => setLevelFilter(isSelected ? "all" : stage.kaderisasiLevel)}
            className={`cursor-pointer rounded-2xl border p-3.5 transition-all shadow-2xs ${
              isSelected
                ? "ring-2 ring-primary border-primary bg-primary/5"
                : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`grid h-8 w-8 place-items-center rounded-xl border ${stage.badgeColor} ${stage.borderClass}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Tahap {stage.step}
              </span>
            </div>
            <div className="mt-2.5">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                {stage.title}
              </h4>
              <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {stage.nickname}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                "{stage.roadQuote}"
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

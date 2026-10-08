import { getOjolJenjang } from "@/lib/ojol-jenjang";
import { cn } from "@/lib/utils";

interface MemberJenjangBadgeProps {
  jenjang?: string | null;
  size?: "sm" | "default" | "lg";
  showNickname?: boolean;
  className?: string;
}

export function MemberJenjangBadge({
  jenjang,
  size = "default",
  showNickname = false,
  className,
}: MemberJenjangBadgeProps) {
  const meta = getOjolJenjang(jenjang);
  const Icon = meta.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    default: "px-2.5 py-0.5 text-xs gap-1.5",
    lg: "px-3 py-1 text-xs gap-1.5 font-semibold",
  }[size];

  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-colors shadow-2xs",
        meta.badgeColor,
        meta.borderClass,
        sizeClasses,
        className,
      )}
      title={`${meta.title} (${meta.nickname}) — ${meta.roadQuote}`}
    >
      <Icon className={cn(iconSizes, "shrink-0 opacity-90")} />
      <span>{meta.title}</span>
      {showNickname && (
        <span className="opacity-70 text-[10px] font-normal border-l border-current/20 pl-1">
          {meta.nickname}
        </span>
      )}
    </span>
  );
}

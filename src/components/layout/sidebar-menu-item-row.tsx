import React from "react";
import { Link } from "@tanstack/react-router";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  item: {
    title: string;
    url: string;
    icon: LucideIcon;
  };
  isActive: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarMenuItemRow({ item, isActive, collapsed, onNavigate }: Props) {
  const Icon = item.icon;

  return (
    <li className="relative group/item">
      <Link
        to={item.url}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none select-none",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:scale-[0.98]",
          isActive
            ? "bg-emerald-600/12 text-emerald-950 font-semibold border border-emerald-600/25 shadow-xs dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30"
            : "text-neutral-700 hover:bg-sidebar-accent hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-sidebar-accent",
          collapsed ? "justify-center px-2 py-3" : "",
        )}
      >
        {/* Active Indicator Bar */}
        {isActive && (
          <span
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-300",
              collapsed ? "h-6" : "h-5",
            )}
          />
        )}

        <Icon
          className={cn(
            "shrink-0 transition-transform duration-200 group-hover/item:scale-110",
            isActive
              ? "text-emerald-800 dark:text-emerald-300 stroke-[2.2]"
              : "text-neutral-600 group-hover/item:text-neutral-900 dark:text-neutral-400 dark:group-hover/item:text-neutral-100 stroke-[1.85]",
            collapsed ? "h-5 w-5" : "h-4 w-4",
          )}
        />

        {!collapsed && (
          <span className="truncate text-xs sm:text-sm font-medium leading-none">{item.title}</span>
        )}
      </Link>

      {/* Floating Tooltip in Mini Mode */}
      {collapsed && (
        <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-sidebar-border bg-popover/95 px-2.5 py-1.5 text-xs font-semibold text-popover-foreground shadow-md backdrop-blur-sm opacity-0 transition-all duration-150 group-hover/item:opacity-100 group-hover/item:translate-x-0 -translate-x-1">
          {item.title}
        </div>
      )}
    </li>
  );
}

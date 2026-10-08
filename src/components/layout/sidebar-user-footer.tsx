import { useMe } from "@/hooks/use-me";
import { useSidebar } from "@/components/ui/sidebar-context";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface SidebarUserFooterProps {
  collapsed?: boolean;
}

export function SidebarUserFooter({ collapsed = false }: SidebarUserFooterProps) {
  const { data: me } = useMe();
  const { toggleSidebar, open } = useSidebar();

  const nama = me?.nama || "Anggota DRG";
  const initials =
    nama
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "DR";

  const roleLabel =
    me?.role === "ketua"
      ? "Ketua Paguyuban"
      : me?.role === "sekretaris"
        ? "Juru Tulis Rembug"
        : me?.role === "admin" || me?.role === "super_admin"
          ? "Pengurus Basecamp"
          : me?.role === "korlap"
            ? "Korlap Satgas Jalur"
            : me?.role === "satgas"
              ? "Satgas Siaga Aspal"
              : me?.role === "bendahara"
                ? "Bendahara Kas Guyub"
                : me?.role === "dewan_etik"
                  ? "Dewan Rembug Marwah"
                  : "Pejuang Satu Aspal";

  if (collapsed) {
    return (
      <div className="relative group/user flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600/15 font-display text-xs font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 transition-transform hover:scale-105"
        >
          {initials}
        </button>
        <div className="pointer-events-none absolute left-full bottom-0 z-50 ml-3 whitespace-nowrap rounded-lg border border-border bg-popover/95 px-2.5 py-1.5 text-xs text-popover-foreground shadow-md backdrop-blur-sm opacity-0 transition-opacity group-hover/user:opacity-100">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{nama}</p>
          <p className="text-[10px] text-neutral-600 dark:text-neutral-400">{roleLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-600/15 font-display text-xs font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 shadow-xs">
          {initials}
        </div>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-xs font-bold text-neutral-900 dark:text-neutral-100">
            {nama}
          </span>
          <span className="truncate text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
            {roleLabel}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-8 w-8 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white shrink-0 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
        title={open ? "Kecilkan sidebar (Mini)" : "Perlebar sidebar"}
      >
        {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </Button>
    </div>
  );
}

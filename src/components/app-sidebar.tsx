import { Link, useRouterState } from "@tanstack/react-router";
import { useMe } from "@/hooks/use-me";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { operasionalNav, getAdminNav, kaderisasiNav } from "@/components/layout/sidebar-nav-config";
import { SidebarUserFooter } from "@/components/layout/sidebar-user-footer";
import { SidebarMenuItemRow } from "@/components/layout/sidebar-menu-item-row";

export function AppSidebar() {
  const { effectiveOpen, isMobile, setOpen } = useSidebar();
  const collapsed = !effectiveOpen;
  const { data: me } = useMe();
  const isAdmin = Boolean(
    me?.isAdmin ||
    me?.role === "admin" ||
    me?.role === "korlap" ||
    (Array.isArray((me as unknown as { roles?: string[] })?.roles) &&
      (me as unknown as { roles?: string[] }).roles?.some(
        (r) => r === "admin" || r === "super_admin",
      )),
  );
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const groups = [
    { label: "Operasional", items: operasionalNav },
    { label: "Administrasi", items: getAdminNav(isAdmin) },
    { label: "Kaderisasi", items: kaderisasiNav },
  ];

  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);
  const handleNav = () => {
    if (isMobile) setOpen(false);
  };

  return (
    <Sidebar className="border-r border-border/80 select-none">
      <SidebarHeader className="px-3 py-4">
        <Link to="/dashboard" onClick={handleNav} className="flex items-center gap-3 group/brand">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-warm text-primary-foreground shadow-warm transition-transform group-hover/brand:scale-105">
            <span className="font-display text-lg font-bold">D</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-display text-base font-bold text-foreground">DRG App</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Riang Gembira
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-1">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="mb-2">
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70 px-3 pb-1">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <SidebarMenuItemRow
                    key={item.url}
                    item={item}
                    isActive={isActive(item.url)}
                    collapsed={collapsed}
                    onNavigate={handleNav}
                  />
                ))}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 p-3 bg-muted/15">
        <SidebarUserFooter collapsed={collapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}

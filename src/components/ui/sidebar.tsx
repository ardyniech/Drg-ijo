import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar, SidebarProvider } from "./sidebar-context";

export { useSidebar, SidebarProvider };
export {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "./sidebar-primitives";

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { effectiveOpen, setHovered, isMobile, setOpen } = useSidebar();

    return (
      <>
        {/* Mobile Backdrop */}
        {isMobile && effectiveOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-xs transition-opacity duration-300 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          ref={ref}
          data-state={effectiveOpen ? "expanded" : "collapsed"}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-out shadow-xs md:sticky md:top-0 md:h-screen",
            effectiveOpen
              ? "w-64"
              : isMobile
                ? "-translate-x-full md:translate-x-0 md:w-20"
                : "w-20",
            isMobile && effectiveOpen ? "translate-x-0 shadow-2xl" : "",
            className,
          )}
          {...props}
        />
      </>
    );
  },
);
Sidebar.displayName = "Sidebar";

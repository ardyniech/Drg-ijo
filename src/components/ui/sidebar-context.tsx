import * as React from "react";
import { useSidebarGestures } from "./use-sidebar-gestures";

export interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isHovered: boolean;
  setHovered: (hovered: boolean) => void;
  autoHoverExpand: boolean;
  setAutoHoverExpand: (val: boolean) => void;
  isMobile: boolean;
  effectiveOpen: boolean;
}

const SidebarContext = React.createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isHovered, setHovered] = React.useState(false);
  const [autoHoverExpand, setAutoHoverExpand] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if ("vibrate" in navigator) navigator.vibrate(10);
      return next;
    });
  }, []);

  useSidebarGestures({ open, setOpen, isMobile });

  const effectiveOpen = isMobile ? open : open || (isHovered && autoHoverExpand);

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        toggleSidebar,
        isHovered,
        setHovered,
        autoHoverExpand,
        setAutoHoverExpand,
        isMobile,
        effectiveOpen,
      }}
    >
      <div className="flex min-h-screen w-full">{children}</div>
    </SidebarContext.Provider>
  );
}

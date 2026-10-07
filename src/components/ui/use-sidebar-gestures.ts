import { useEffect, useRef } from "react";

interface GestureOptions {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
}

export function useSidebarGestures({ open, setOpen, isMobile }: GestureOptions) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // Only respond if movement is predominantly horizontal
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.4 && Math.abs(deltaX) > 45) {
        // Swipe Right from left edge or anywhere on mobile when closed
        if (deltaX > 0 && !open && (touchStartX.current < 40 || isMobile)) {
          setOpen(true);
          if ("vibrate" in navigator) navigator.vibrate(15);
        }
        // Swipe Left to close when opened
        else if (deltaX < 0 && open) {
          setOpen(false);
          if ("vibrate" in navigator) navigator.vibrate(10);
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [open, setOpen, isMobile]);
}

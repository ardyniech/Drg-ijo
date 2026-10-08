/**
 * System Theme Synchronization Utility (SOP v4.0)
 * Mengatur kelas 'dark' pada document.documentElement secara adaptif
 * mengikuti preferensi sistem OS / browser (dark vs bright).
 */
export function initSystemThemeSync(): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Terapkan saat inisialisasi awal
  applyTheme(mediaQuery.matches);

  // Tanggapi perubahan tema sistem OS secara langsung tanpa reload
  const listener = (e: MediaQueryListEvent) => {
    applyTheme(e.matches);
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }

  // Fallback untuk browser lawas
  mediaQuery.addListener(listener);
  return () => mediaQuery.removeListener(listener);
}

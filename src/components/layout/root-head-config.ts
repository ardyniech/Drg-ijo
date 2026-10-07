import appCss from "../../styles.css?url";

export function getRootHead() {
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DRG App — Platform Komunitas Driver Riang Gembira" },
      {
        name: "description",
        content:
          "Platform operasional Komunitas DRG: data anggota, kas transparan, SOS & peta lokasi, piket Satgas, dan kaderisasi.",
      },
      { property: "og:title", content: "DRG App — Platform Komunitas Driver Riang Gembira" },
      {
        property: "og:description",
        content:
          "Platform operasional Komunitas DRG: data anggota, kas transparan, SOS & peta lokasi, piket Satgas, dan kaderisasi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#00B14F" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "DRG" },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/icon-512.png", sizes: "512x512" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
        crossOrigin: "",
      },
    ],
  };
}

// DRG App Service Worker — Web Push + PWA Offline Cache Shell
const CACHE_NAME = "drg-app-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  // Skip cross-origin API calls or WebSockets
  if (url.origin !== self.location.origin) return;

  // Skip caching completely in development environments to avoid Vite dynamic import caching errors
  if (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname.includes("ais-dev-") ||
    url.pathname.includes("/node_modules/") ||
    url.pathname.includes("/@fs/") ||
    url.pathname.includes("/@id/") ||
    url.search.includes("v=")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networked = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const cacheCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
          }
          return response;
        })
        .catch(() => cached || caches.match("/index.html"));

      return cached || networked;
    }),
  );
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    data = { title: "DRG App", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "🚨 SOS DRG";
  const options = {
    body: data.body || "Ada panggilan darurat dari rekan.",
    icon: "/icon-512.png",
    badge: "/icon-512.png",
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || "drg-sos",
    renotify: true,
    requireInteraction: true,
    data: { url: data.url || "/kejadian" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/kejadian";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ("focus" in c) {
          c.navigate(target);
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    }),
  );
});

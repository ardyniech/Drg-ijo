import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https: wss: ws:; frame-ancestors 'self' *;",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
    headers: SECURITY_HEADERS,
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
    headers: SECURITY_HEADERS,
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    routeRules: {
      "/**": {
        headers: SECURITY_HEADERS,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});

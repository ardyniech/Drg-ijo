import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_USERS } from "@/modules/auth/logic/local-auth-store";
import { verifyPassword } from "@/modules/auth/logic/password-hasher";
import { generatePrefixedId } from "@/shared/utils/id-generator";

export const Route = createFileRoute("/api/auth")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { action, email, password, nama } = body;

          if (action === "signin") {
            const cleanEmail = (email ?? "").trim().toLowerCase();
            const user = DEFAULT_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
            if (!user) {
              return new Response(JSON.stringify({ error: "Email atau kata sandi tidak valid." }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
              });
            }

            const { isValid } = await verifyPassword(password, user.passwordHash);
            if (!isValid) {
              return new Response(JSON.stringify({ error: "Email atau kata sandi tidak valid." }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
              });
            }

            return new Response(
              JSON.stringify({
                status: "success",
                user: { id: user.id, email: user.email, nama: user.nama, role: user.role },
                token: generatePrefixedId(`srv_tok_${user.id}`),
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          }

          if (action === "signup") {
            const cleanEmail = (email ?? "").trim().toLowerCase();
            const cleanName = (nama ?? "").trim();
            if (!cleanName || !cleanEmail || (password ?? "").length < 6) {
              return new Response(
                JSON.stringify({
                  error: "Data pendaftaran tidak lengkap atau password < 6 karakter.",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } },
              );
            }

            const newId = generatePrefixedId("usr");
            return new Response(
              JSON.stringify({
                status: "success",
                user: { id: newId, email: cleanEmail, nama: cleanName, role: "anggota" },
                token: generatePrefixedId(`srv_tok_${newId}`),
              }),
              { status: 201, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(JSON.stringify({ status: "ok" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Internal server error";
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});

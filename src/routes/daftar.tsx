import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/daftar")({
  beforeLoad: () => {
    throw redirect({ to: "/auth", search: { mode: "signup" } });
  },
  component: () => null,
});

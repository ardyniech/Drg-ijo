import { useMe } from "./use-me";

export function useIs(requiredRole: string | string[]) {
  const { data: me } = useMe();
  if (!me) return false;

  if (Array.isArray(requiredRole)) {
    return (
      (requiredRole as string[]).includes(me.role) ||
      (me.isAdmin && (requiredRole as string[]).includes("admin"))
    );
  }
  return me.role === requiredRole || (me.isAdmin && requiredRole === "admin");
}

export function useMyRole() {
  const { data: me, isLoading } = useMe();
  const roles = me ? [me.role, ...(me.isAdmin && me.role !== "admin" ? ["admin"] : [])] : [];
  return {
    role: me?.role ?? "driver",
    roles,
    data: roles,
    isAdmin: me?.isAdmin ?? false,
    isPendingReview: me?.isPendingReview ?? false,
    isLoading,
  };
}

export const useMyRoles = useMyRole;

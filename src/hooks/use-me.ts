import { useQuery } from "@tanstack/react-query";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { supabase } from "@/integrations/supabase/client";

export type UserRole =
  | "ketua"
  | "sekretaris"
  | "bendahara"
  | "admin"
  | "super_admin"
  | "korlap"
  | "satgas"
  | "dewan_etik"
  | "anggota"
  | "driver";

export interface UserProfileMe {
  id: string;
  email: string;
  nama: string;
  role: UserRole;
  roleTitle: string;
  status: "aktif" | "pending_review" | "nonaktif";
  isPendingReview: boolean;
  isAdmin: boolean;
  pangkalan?: string;
  foto_url?: string | null;
}

export function getRoleTitle(role: UserRole): string {
  switch (role) {
    case "ketua":
      return "Ketua Umum";
    case "sekretaris":
      return "Sekretaris Jenderal";
    case "bendahara":
      return "Bendahara Keuangan";
    case "admin":
      return "Admin Platform";
    case "super_admin":
      return "Super Administrator";
    case "korlap":
      return "Korlap Satgas";
    case "satgas":
      return "Satgas Lapangan";
    case "dewan_etik":
      return "Dewan Etik";
    case "anggota":
    case "driver":
    default:
      return "Driver Anggota";
  }
}

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<UserProfileMe | null> => {
      const session = LocalAuthClient.getSession();
      if (!session?.user) return null;

      const user = session.user;
      const { data: profile } = await supabase
        .from("profiles")
        .select("nama, status, role, pangkalan, foto_url")
        .eq("id", user.id)
        .maybeSingle();

      const rawRole = profile?.role || user.user_metadata?.role || "driver";
      const role = (rawRole === "member" ? "anggota" : rawRole) as UserRole;
      const status = (profile?.status || "aktif") as "aktif" | "pending_review" | "nonaktif";
      const isAdmin =
        role === "ketua" ||
        role === "sekretaris" ||
        role === "admin" ||
        role === "super_admin" ||
        role === "korlap" ||
        role === "bendahara";

      return {
        id: user.id,
        email: user.email || "",
        nama: profile?.nama || user.user_metadata?.nama || "Anggota DRG",
        role,
        roleTitle: getRoleTitle(role),
        status,
        isPendingReview: status === "pending_review",
        isAdmin,
        pangkalan: profile?.pangkalan || "Pangkalan Utama DRG",
        foto_url: profile?.foto_url || null,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMemberOptions() {
  return useQuery({
    queryKey: ["member-options"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nama, status")
        .eq("status", "aktif")
        .order("nama");
      if (error) throw error;
      return data ?? [];
    },
  });
}

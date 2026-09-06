import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ScreeningAnswerItem,
  ScreeningApplication,
  ScreeningAuditItem,
  ScreeningStatus,
} from "../types";

export function useScreeningReview(app: ScreeningApplication | null, onClose: () => void) {
  const qc = useQueryClient();
  const [status, setStatus] = useState<ScreeningStatus>("menunggu");
  const [catatan, setCatatan] = useState("");

  const { data: answers = [] } = useQuery({
    queryKey: ["screening-answers", app?.id],
    enabled: !!app,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("screening_answers")
        .select("jawaban, bobot_didapat, question_id, screening_questions(pertanyaan, bobot_max)")
        .eq("application_id", app!.id);
      if (error) throw error;
      return (data ?? []) as unknown as ScreeningAnswerItem[];
    },
  });

  const { data: audit = [] } = useQuery({
    queryKey: ["screening-audit", app?.id],
    enabled: !!app,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("screening_audit_log")
        .select("id, old_status, new_status, note, created_at, actor_id, profiles:actor_id(nama)")
        .eq("application_id", app!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as ScreeningAuditItem[];
    },
  });

  useEffect(() => {
    if (app) {
      setStatus(app.status);
      setCatatan(app.catatan_pic ?? "");
    }
  }, [app]);

  const save = useMutation({
    mutationFn: async () => {
      if (!app) return;
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("screening_applications")
        .update({
          status,
          catatan_pic: catatan || null,
          reviewed_by: u.user?.id ?? null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", app.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Keputusan disimpan");
      qc.invalidateQueries({ queryKey: ["screening-apps"] });
      qc.invalidateQueries({ queryKey: ["screening-audit", app?.id] });
      onClose();
    },
    onError: (e: Error) => toast.error("Gagal", { description: e.message }),
  });

  return {
    status,
    setStatus,
    catatan,
    setCatatan,
    answers,
    audit,
    save,
  };
}

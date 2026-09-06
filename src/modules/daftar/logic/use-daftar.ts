import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DaftarDoneState, DaftarFormState, ScreeningQuestion } from "../types";

export function useDaftar() {
  const { data: questions = [], isLoading } = useQuery<ScreeningQuestion[]>({
    queryKey: ["screening-q-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("screening_questions_public")
        .select("*")
        .order("urutan");
      if (error) throw error;
      return (data ?? []) as ScreeningQuestion[];
    },
  });

  const [form, setForm] = useState<DaftarFormState>({
    nama: "",
    no_hp: "",
    email: "",
    alamat: "",
    kota: "",
    motivasi: "",
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState<DaftarDoneState | null>(null);

  const canSubmit = useMemo(
    () =>
      form.nama.trim().length > 2 &&
      form.no_hp.trim().length > 6 &&
      /.+@.+\..+/.test(form.email.trim()),
    [form],
  );

  const submit = useMutation({
    mutationFn: async () => {
      const payloadAnswers = questions
        .filter((q) => answers[q.id])
        .map((q) => ({ question_id: q.id, jawaban: answers[q.id] }));

      const { data, error } = await supabase.rpc("submit_screening_application", {
        _nama: form.nama.trim(),
        _no_hp: form.no_hp.trim(),
        _email: form.email.trim(),
        _alamat: form.alamat.trim() || undefined,
        _kota: form.kota.trim() || undefined,
        _motivasi: form.motivasi.trim() || undefined,
        _answers: payloadAnswers,
      });
      if (error) throw error;
      if (!data) throw new Error("Token verifikasi tidak diterima.");
      return data as string;
    },
    onSuccess: (token) => {
      setDone({ token, email: form.email });
      toast.success("Pendaftaran berhasil diterima di server lokal!");
    },
    onError: (e: Error) => toast.error("Gagal mengirim", { description: e.message }),
  });

  return {
    form,
    setForm,
    answers,
    setAnswers,
    questions,
    isLoading,
    canSubmit,
    submit,
    done,
  };
}

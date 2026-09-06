import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileRow } from "../types";

export function useProfil() {
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setAuthEmail(data.user?.email ?? null);
    });
  }, []);

  const { data: profile, isLoading } = useQuery({
    enabled: !!userId,
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nama, foto_url, jenjang, status, bio, created_at, updated_at, notif_sos, notif_kas, notif_pengumuman, notif_email")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const { data: contacts } = await supabase.rpc("member_contacts");
      const mine = (contacts ?? []).find((c) => c.id === userId);
      return {
        ...data,
        no_hp: mine?.no_hp ?? null,
        alamat: mine?.alamat ?? null,
        email: mine?.email ?? null,
      } as ProfileRow;
    },
  });

  const [form, setForm] = useState<Partial<ProfileRow>>({});
  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const saveBio = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Tidak ada sesi");
      const { error } = await supabase
        .from("profiles")
        .update({
          nama: form.nama ?? "",
          no_hp: form.no_hp ?? null,
          alamat: form.alamat ?? null,
          bio: form.bio ?? null,
          email: form.email ?? null,
          jenjang: (form.jenjang ?? "calon") as ProfileRow["jenjang"],
        })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Biodata tersimpan");
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      qc.invalidateQueries({ queryKey: ["anggota"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveNotif = useMutation({
    mutationFn: async (patch: Partial<ProfileRow>) => {
      if (!userId) throw new Error("Tidak ada sesi");
      const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", userId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleAvatarUpload(file: File) {
    if (!userId) return;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) return toast.error(upErr.message);
    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60 * 24 * 365);
    const url = signed?.signedUrl ?? null;
    const { error } = await supabase.from("profiles").update({ foto_url: url }).eq("id", userId);
    if (error) return toast.error(error.message);
    toast.success("Foto profil diperbarui");
    qc.invalidateQueries({ queryKey: ["profile", userId] });
  }

  return {
    userId,
    authEmail,
    profile,
    isLoading,
    form,
    setForm,
    saveBio,
    saveNotif,
    handleAvatarUpload,
  };
}

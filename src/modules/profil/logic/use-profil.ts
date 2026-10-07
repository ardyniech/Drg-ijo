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
        .select("*")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return (data as ProfileRow) ?? null;
    },
  });

  const [form, setForm] = useState<Partial<ProfileRow>>({});
  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const canEditJenjang = false;

  const saveBio = useMutation({
    mutationFn: async (updatedValues?: Partial<ProfileRow>) => {
      if (!userId) throw new Error("Tidak ada sesi login aktif");
      const dataToSave = updatedValues ? { ...form, ...updatedValues } : form;
      const { error } = await supabase
        .from("profiles")
        .update({
          nama: dataToSave.nama ?? "",
          no_hp: dataToSave.no_hp ?? null,
          alamat: dataToSave.alamat ?? null,
          bio: dataToSave.bio ?? null,
          email: dataToSave.email ?? null,
          tanggal_lahir: dataToSave.tanggal_lahir ?? null,
          jenis_kelamin: dataToSave.jenis_kelamin ?? null,
          golongan_darah: dataToSave.golongan_darah ?? null,
          plat_nomor: dataToSave.plat_nomor ?? null,
          jenis_kendaraan: dataToSave.jenis_kendaraan ?? null,
          merk_kendaraan: dataToSave.merk_kendaraan ?? null,
          nomor_stnk: dataToSave.nomor_stnk ?? null,
          pangkalan: dataToSave.pangkalan ?? null,
          nomor_anggota: dataToSave.nomor_anggota ?? null,
          kontak_darurat_nama: dataToSave.kontak_darurat_nama ?? null,
          kontak_darurat_hp: dataToSave.kontak_darurat_hp ?? null,
          kontak_darurat_hubungan: dataToSave.kontak_darurat_hubungan ?? null,
          jenjang: canEditJenjang ? (dataToSave.jenjang ?? "calon") : (profile?.jenjang ?? "calon"),
        })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Biodata profil berhasil diperbarui");
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      qc.invalidateQueries({ queryKey: ["anggota"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveNotif = useMutation({
    mutationFn: async (patch: Partial<ProfileRow>) => {
      if (!userId) throw new Error("Tidak ada sesi login aktif");
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
    canEditJenjang,
  };
}

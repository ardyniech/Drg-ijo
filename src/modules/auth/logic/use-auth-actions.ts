import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { LocalAuthClient } from "./local-auth-client";

export function useAuthActions() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { session, error } = await LocalAuthClient.signIn(email, password);
    setLoading(false);

    if (error || !session) {
      return toast.error("Gagal Masuk", {
        description: error?.message || "Email atau kata sandi tidak cocok.",
      });
    }

    toast.success(`Selamat datang, ${session.user.user_metadata.nama}!`);
    try {
      await navigate({ to: "/dashboard", replace: true });
    } catch {
      window.location.href = "/dashboard";
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { session, error } = await LocalAuthClient.signUp({
      email,
      password,
      nama: fullName,
    });
    setLoading(false);

    if (error || !session) {
      return toast.error("Pendaftaran Gagal", {
        description: error?.message || "Gagal membuat akun.",
      });
    }

    toast.success("Akun Berhasil Dibuat!", {
      description: "Kamu telah terdaftar dan langsung masuk ke dashboard.",
    });
    try {
      await navigate({ to: "/dashboard", replace: true });
    } catch {
      window.location.href = "/dashboard";
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    handleSignIn,
    handleSignUp,
  };
}

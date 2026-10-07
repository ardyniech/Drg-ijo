import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, UserPlus, ClipboardList, ShieldCheck } from "lucide-react";

interface Props {
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignUpForm({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
}: Props) {
  const [showPw, setShowPw] = useState(false);

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>Formulir Pendaftaran Terpadu DRG</span>
        </div>
        <p>
          Ingin mendaftar sebagai Calon Driver resmi? Gunakan{" "}
          <Link to="/daftar" className="font-bold text-primary underline">
            Formulir Pendaftaran Driver Resmi (/daftar)
          </Link>{" "}
          untuk pengisian data lengkap & screening.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nama sesuai identitas KTP/SIM"
          autoComplete="name"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email2">Email</Label>
        <Input
          id="email2"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="driver@contoh.com"
          autoComplete="email"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password2">Kata Sandi</Label>
        <div className="relative">
          <Input
            id="password2"
            type={showPw ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label={showPw ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
          )}
          Daftar Akun
        </Button>

        <Button
          type="button"
          variant="outline"
          className="border-primary/40 text-primary hover:bg-primary/10 text-xs"
          asChild
        >
          <Link to="/daftar">
            <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
            Daftar Driver
          </Link>
        </Button>
      </div>
    </form>
  );
}

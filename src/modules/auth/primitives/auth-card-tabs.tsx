import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

interface Props {
  tab: "signin" | "signup";
  setTab: (val: "signin" | "signup") => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  fullName: string;
  setFullName: (val: string) => void;
  loading: boolean;
  onSignIn: (e: React.FormEvent) => void;
  onSignUp: (e: React.FormEvent) => void;
}

export function AuthCardTabs({
  tab,
  setTab,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  loading,
  onSignIn,
  onSignUp,
}: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <Badge
          variant="outline"
          className="gap-1.5 border-primary/30 bg-primary/5 text-primary text-[11px]"
        >
          <Shield className="h-3 w-3" /> Autentikasi Komunitas DRG
        </Badge>
        <span className="text-[11px] text-muted-foreground">Server Terenkripsi</span>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Masuk</TabsTrigger>
          <TabsTrigger value="signup">Daftar Baru</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onSubmit={onSignIn}
          />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onSubmit={onSignUp}
          />
        </TabsContent>
      </Tabs>

      <p className="mt-5 text-center text-[11px] text-muted-foreground">
        Hak akses dan data anggota dikelola sesuai tata tertib Komunitas Driver Riang Gembira.
      </p>
    </div>
  );
}

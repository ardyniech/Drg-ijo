import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function ProfilePasswordCard() {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  async function handleChangePassword() {
    if (pw1.length < 8) return toast.error("Password minimal 8 karakter");
    if (pw1 !== pw2) return toast.error("Konfirmasi password tidak cocok");
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    setPwLoading(false);
    if (error) return toast.error(error.message);
    setPw1("");
    setPw2("");
    toast.success("Password diperbarui");
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <KeyRound className="h-4 w-4" /> Ubah Kata Sandi
        </CardTitle>
        <CardDescription>Minimal 8 karakter.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="pw1">Password baru</Label>
          <Input id="pw1" type="password" value={pw1} onChange={(e) => setPw1(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw2">Konfirmasi</Label>
          <Input id="pw2" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleChangePassword}
          disabled={pwLoading}
        >
          {pwLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Perbarui password
        </Button>
      </CardContent>
    </Card>
  );
}

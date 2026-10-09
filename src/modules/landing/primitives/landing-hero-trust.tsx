import { Users, ShieldCheck, HeartHandshake } from "lucide-react";

export function LandingHeroTrust() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5 font-medium">
        <Users className="h-4 w-4 text-primary" />
        Udah dipercaya bareng-bareng buat jaga saudara di Malang Raya
      </span>
      <span className="flex items-center gap-1.5 font-medium">
        <ShieldCheck className="h-4 w-4 text-primary" />
        Verifikasi singkat • Gratiss
      </span>
      <span className="flex items-center gap-1.5 font-medium">
        <HeartHandshake className="h-4 w-4 text-primary" />
        Dana Santunan Terbuka
      </span>
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { LogOut, User, Settings, ShieldCheck } from "lucide-react";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { useMe } from "@/hooks/use-me";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserMenu() {
  const navigate = useNavigate();
  const { data: me } = useMe();
  const nama = me?.nama || "Anggota DRG";
  const email = me?.email || "driver@drg.id";
  const role = me?.role || "driver";
  const initial = nama.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await LocalAuthClient.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{nama}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-primary">
              <ShieldCheck className="h-3 w-3" />
              <span className="capitalize">{role} Terverifikasi</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/profil" })}>
          <User className="mr-2 h-4 w-4" />
          <span>Profil Saya</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/pengaturan" })}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Pengaturan Sistem</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

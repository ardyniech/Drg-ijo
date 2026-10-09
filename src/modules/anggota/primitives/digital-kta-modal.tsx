import { Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MemberRecord } from "../types";
import { DigitalKtaCard } from "./digital-kta-card";

export function DigitalKtaModal({ member }: { member: MemberRecord }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
        >
          <Award className="h-3.5 w-3.5" /> KTA Digital
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden bg-transparent border-0 shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Kartu Tanda Anggota Digital — {member.nama}</DialogTitle>
        </DialogHeader>
        <DigitalKtaCard member={member} />
      </DialogContent>
    </Dialog>
  );
}

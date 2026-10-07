import { ShieldCheck, QrCode, Award, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemberRecord } from "../types";
import { toast } from "sonner";

export function DigitalKtaModal({ member }: { member: MemberRecord }) {
  const handleShare = () => {
    const text = `*KARTU TANDA ANGGOTA RESMI DRG*\nNama: ${member.nama}\nNo KTA: ${member.no_kta}\nPangkalan: ${member.pangkalan}\nJenjang: ${member.jenjang}\nStatus: ${member.status.toUpperCase()}\n\n_Diverifikasi oleh Dewan Pengurus Komunitas DRG_`;
    navigator.clipboard.writeText(text);
    toast.success("Info KTA Digital disalin ke clipboard!");
  };

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
        <div className="relative overflow-hidden rounded-2xl border border-emerald-600/40 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-xs">
                DRG
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wider text-emerald-400">
                  KARTU TANDA ANGGOTA
                </h4>
                <p className="text-[10px] text-slate-400">Driver Riang Gembira</p>
              </div>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
              {member.status === "aktif" ? "TERVERIFIKASI" : "PENDING"}
            </Badge>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Nama Anggota</p>
                <h3 className="text-base font-bold text-white">{member.nama}</h3>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">{member.no_kta}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white p-1">
                <QrCode className="h-14 w-14 text-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
              <div>
                <p className="text-slate-400">Pangkalan</p>
                <p className="font-semibold text-slate-200">{member.pangkalan}</p>
              </div>
              <div>
                <p className="text-slate-400">Jenjang Kader</p>
                <p className="font-semibold text-emerald-400">{member.jenjang}</p>
              </div>
              <div>
                <p className="text-slate-400">Kendaraan</p>
                <p className="font-semibold text-slate-200">{member.plat_nomor}</p>
              </div>
              <div>
                <p className="text-slate-400">Bergabung</p>
                <p className="font-semibold text-slate-200">{member.bergabung_sejak}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-emerald-500/20 pt-3 text-[9px] text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>Sah DPP DRG</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
              className="h-6 gap-1 px-2 text-[10px] text-emerald-300 hover:bg-emerald-900/40 hover:text-emerald-200"
            >
              <Share2 className="h-3 w-3" /> Bagikan KTA
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

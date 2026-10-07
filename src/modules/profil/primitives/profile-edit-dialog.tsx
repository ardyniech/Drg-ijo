import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Save, User, Car, Phone } from "lucide-react";
import { ProfileRow } from "../types";
import { EditPersonalTab } from "./edit-personal-tab";
import { EditVehicleTab } from "./edit-vehicle-tab";
import { EditContactTab } from "./edit-contact-tab";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: Partial<ProfileRow>;
  onChange: (patch: Partial<ProfileRow>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function ProfileEditDialog({ open, onOpenChange, form, onChange, onSave, isSaving }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Perbarui Biodata Lengkap</DialogTitle>
          <DialogDescription>
            Lengkapi data pribadi, kendaraan operasional, dan kontak darurat kamu.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center gap-1.5 text-xs">
              <User className="h-3.5 w-3.5" /> Pribadi
            </TabsTrigger>
            <TabsTrigger value="vehicle" className="flex items-center gap-1.5 text-xs">
              <Car className="h-3.5 w-3.5" /> Kendaraan
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1.5 text-xs">
              <Phone className="h-3.5 w-3.5" /> Kontak & SOS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <EditPersonalTab form={form} onChange={(patch) => onChange({ ...form, ...patch })} />
          </TabsContent>

          <TabsContent value="vehicle">
            <EditVehicleTab form={form} onChange={(patch) => onChange({ ...form, ...patch })} />
          </TabsContent>

          <TabsContent value="contact">
            <EditContactTab form={form} onChange={(patch) => onChange({ ...form, ...patch })} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Batal
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

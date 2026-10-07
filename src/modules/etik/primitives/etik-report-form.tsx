import { useState } from "react";
import { toast } from "sonner";
import { NewEtikCasePayload, ViolationSeverity } from "../types";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { EtikReportFields } from "./etik-report-fields";

interface EtikReportFormProps {
  onCancel: () => void;
  onSubmit: (payload: NewEtikCasePayload) => void;
}

export function EtikReportForm({ onCancel, onSubmit }: EtikReportFormProps) {
  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [category, setCategory] = useState("Perselisihan Lapangan");
  const [severity, setSeverity] = useState<ViolationSeverity>("Ringan");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [desc, setDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanDesc = desc.trim();
    const cleanLoc = location.trim();
    if (!cleanName || !cleanDesc || !cleanLoc) {
      toast.error("Nama terlapor, lokasi, dan uraian kejadian wajib diisi");
      return;
    }
    onSubmit({
      reportedMemberName: cleanName,
      reportedMemberId: memberId.trim() || "DRG-TMP",
      category,
      severity,
      location: cleanLoc,
      incidentDate: date,
      description: cleanDesc,
    });
    setName("");
    setMemberId("");
    setLocation("");
    setDesc("");
  };

  const isFormValid = Boolean(name.trim() && desc.trim() && location.trim());

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <EtikReportFields
        name={name}
        setName={setName}
        memberId={memberId}
        setMemberId={setMemberId}
        category={category}
        setCategory={setCategory}
        severity={severity}
        setSeverity={setSeverity}
        location={location}
        setLocation={setLocation}
        date={date}
        setDate={setDate}
        desc={desc}
        setDesc={setDesc}
      />

      <DialogFooter className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl text-xs">
          Batal
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid}
          className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white"
        >
          Kirimkan Laporan
        </Button>
      </DialogFooter>
    </form>
  );
}

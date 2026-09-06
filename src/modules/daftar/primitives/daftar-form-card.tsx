import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { DaftarFormState, ScreeningQuestion } from "../types";
import { DaftarQuestionsSection } from "./daftar-questions-section";

interface Props {
  form: DaftarFormState;
  setForm: React.Dispatch<React.SetStateAction<DaftarFormState>>;
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  questions: ScreeningQuestion[];
  isLoading: boolean;
  canSubmit: boolean;
  isPending: boolean;
  onSubmit: () => void;
}

export function DaftarFormCard({
  form,
  setForm,
  answers,
  setAnswers,
  questions,
  isLoading,
  canSubmit,
  isPending,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
      <section className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="nama">Nama Lengkap *</Label>
          <Input
            id="nama"
            value={form.nama}
            onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))}
            required
            placeholder="Sesuai KTP"
          />
        </div>
        <div>
          <Label htmlFor="hp">No. WhatsApp *</Label>
          <Input
            id="hp"
            value={form.no_hp}
            onChange={(e) => setForm((prev) => ({ ...prev, no_hp: e.target.value }))}
            placeholder="0812…"
            required
          />
        </div>
        <div>
          <Label htmlFor="em">Email Aktif *</Label>
          <Input
            id="em"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="driver@contoh.com"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="al">Alamat Domisili</Label>
          <Input
            id="al"
            value={form.alamat}
            onChange={(e) => setForm((prev) => ({ ...prev, alamat: e.target.value }))}
            placeholder="Jl. Raya..."
          />
        </div>
        <div>
          <Label htmlFor="kt">Kota / Wilayah Operasi</Label>
          <Input
            id="kt"
            value={form.kota}
            onChange={(e) => setForm((prev) => ({ ...prev, kota: e.target.value }))}
            placeholder="Malang / Surabaya"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="mv">Motivasi Bergabung</Label>
          <Textarea
            id="mv"
            rows={2}
            value={form.motivasi}
            onChange={(e) => setForm((prev) => ({ ...prev, motivasi: e.target.value }))}
            placeholder="Alasan bergabung dengan DRG..."
          />
        </div>
      </section>

      {!isLoading && (
        <DaftarQuestionsSection
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
        />
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-muted-foreground">
          Data tersimpan di server lokal DRG untuk evaluasi PIC Kaderisasi.
        </p>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Kirim Pendaftaran
        </Button>
      </div>
    </div>
  );
}

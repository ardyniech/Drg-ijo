import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import {
  DaftarFormCard,
  DaftarSuccessView,
  useDaftar,
} from "@/modules/daftar";

export const Route = createFileRoute("/daftar")({
  head: () => ({
    meta: [
      { title: "Daftar Calon Anggota — DRG" },
      {
        name: "description",
        content: "Formulir pendaftaran calon anggota Komunitas Driver Riang Gembira (DRG).",
      },
    ],
  }),
  component: DaftarPage,
});

function DaftarPage() {
  const {
    form,
    setForm,
    answers,
    setAnswers,
    questions,
    isLoading,
    canSubmit,
    submit,
    done,
  } = useDaftar();

  if (done) {
    return <DaftarSuccessView done={done} />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Beranda
        </Link>
      </div>

      <header className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Pendaftaran Server Lokal DRG
        </div>
        <h1 className="font-display text-3xl font-bold">Daftar Jadi Anggota DRG</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Isi data diri dan jawaban singkat. Data pendaftaran langsung tersimpan di server lokal untuk peninjauan PIC Kaderisasi.
        </p>
      </header>

      <DaftarFormCard
        form={form}
        setForm={setForm}
        answers={answers}
        setAnswers={setAnswers}
        questions={questions}
        isLoading={isLoading}
        canSubmit={canSubmit}
        isPending={submit.isPending}
        onSubmit={() => submit.mutate()}
      />
    </div>
  );
}

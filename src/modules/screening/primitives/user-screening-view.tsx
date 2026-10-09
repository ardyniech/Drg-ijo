import { CheckCircle2, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { useDaftar, DaftarFormCard, DaftarSuccessView } from "@/modules/daftar";
import { ScreeningApplication } from "../types";

interface Props {
  myApp?: ScreeningApplication;
  email: string;
  nama: string;
}

export function UserScreeningView({ myApp, email, nama }: Props) {
  const { form, setForm, answers, setAnswers, questions, isLoading, canSubmit, submit, done } =
    useDaftar();

  if (done) {
    return <DaftarSuccessView done={done} />;
  }

  if (myApp) {
    const isAppr = myApp.status === "approved";
    const isRej = myApp.status === "rejected";

    return (
      <div className="max-w-2xl space-y-6">
        <div
          className={`rounded-2xl border p-5 flex items-start gap-3.5 ${
            isAppr
              ? "border-success/40 bg-success/10 text-success"
              : isRej
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-warn/40 bg-warn/10 text-amber-800 dark:text-amber-200"
          }`}
        >
          {isAppr ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          ) : isRej ? (
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <Clock className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
          )}
          <div className="space-y-1">
            <h3 className="font-bold text-xs">
              {isAppr
                ? "Alhamdulillah! Resmi Diterima Jadi Sedulur DRG"
                : isRej
                  ? "Belum Dapat Bergabung Saat Ini"
                  : "Sedang Ditinjau Dewan Pangkalan Santui"}
            </h3>
            <p className="text-[11px] opacity-90 leading-relaxed">
              {isAppr
                ? "Selamat datang di keluarga besar DRG! Berkas kenalan Anda telah resmi disahkan oleh dewan pangkalan. Salam satu aspal!"
                : isRej
                  ? `Mohon maaf dulur, belum dapat bergabung saat ini. Catatan: ${
                      myApp.catatan_pic || "Tetap semangat dan jaga persaudaraan di jalan."
                    }`
                  : "Kuesioner dulur aman tersimpan. Dewan pangkalan sedang mereview data kenalan Anda dengan teliti & santui."}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 text-[11px]">
          <h4 className="font-bold text-xs border-b pb-2 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" /> Rincian Berkas Terdaftar
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground block mb-0.5">Nama Lengkap</span>
              <span className="font-semibold">{myApp.nama}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">No. WhatsApp</span>
              <span className="font-semibold">{myApp.no_hp}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Alamat Domisili</span>
              <span className="font-semibold">{myApp.alamat || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Kota / Pangkalan</span>
              <span className="font-semibold">{myApp.kota || "—"}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground block mb-0.5">Motivasi Bergabung</span>
            <p className="font-semibold bg-muted/30 p-2.5 rounded-xl border">
              {myApp.motivasi || "—"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
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

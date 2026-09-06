import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScreeningQuestion } from "../types";

interface Props {
  questions: ScreeningQuestion[];
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function DaftarQuestionsSection({ questions, answers, setAnswers }: Props) {
  if (!questions || questions.length === 0) return null;

  return (
    <section className="space-y-4 border-t border-border pt-5">
      <h2 className="font-display text-base font-semibold">Pertanyaan Screening</h2>
      {questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <Label className="text-sm font-medium">
            {q.urutan}. {q.pertanyaan}
          </Label>
          {q.opsi && q.opsi.length ? (
            <div className="flex flex-wrap gap-2">
              {q.opsi.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: o.label }))}
                  className={
                    "rounded-full border px-3 py-1 text-xs transition-colors " +
                    (answers[q.id] === o.label
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border hover:border-primary/50 text-muted-foreground")
                  }
                >
                  {o.label}
                </button>
              ))}
            </div>
          ) : (
            <Textarea
              rows={2}
              value={answers[q.id] ?? ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
            />
          )}
        </div>
      ))}
    </section>
  );
}

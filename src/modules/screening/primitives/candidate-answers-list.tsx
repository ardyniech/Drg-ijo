import { ScreeningAnswerItem } from "../types";

interface Props {
  answers: ScreeningAnswerItem[];
}

export function CandidateAnswersList({ answers }: Props) {
  if (answers.length === 0) return null;

  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
        Jawaban screening
      </div>
      <div className="space-y-2">
        {answers.map((a, i) => (
          <div key={i} className="rounded-lg border border-border p-2 text-sm">
            <div className="text-xs text-muted-foreground">{a.screening_questions?.pertanyaan}</div>
            <div className="mt-0.5 flex items-center justify-between">
              <span>{a.jawaban}</span>
              {a.screening_questions?.bobot_max ? (
                <span className="font-mono text-xs text-primary">
                  {a.bobot_didapat}/{a.screening_questions.bobot_max}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

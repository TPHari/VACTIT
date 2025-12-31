import type { AnswerReviewRow } from "@/components/exam/AnswerReviewPanel2Col";

type TrialResponse = {
  question_id: string;
  chosen_option: string | null;
  question?: {
    correct_option: string | null;
  };
};

export function buildAnswerReviewRows(responses: TrialResponse[]): AnswerReviewRow[] {
  // stable numbering (1..N) based on sorted question_id
  const sorted = [...responses].sort((a, b) =>
    String(a.question_id).localeCompare(String(b.question_id)),
  );

  return sorted.map((r, idx) => {
    const chosen = r.chosen_option ?? "-";
    const correct = r.question?.correct_option ?? "-";
    const isCorrect = chosen !== "-" && correct !== "-" && chosen === correct;

    return {
      number: idx + 1,
      chosen,
      correct,
      isCorrect,
    };
  });
}

import type { AnswerReviewRow } from "@/components/exam/AnswerReviewPanel2Col";

type TrialResponse = {
  question_id: string;
  chosen_option: string | null;
  question?: {
    correct_option: string | null;
  };
};

export function buildAnswerReviewRows(
  responses: TrialResponse[],
): AnswerReviewRow[] {
  const sorted = [...responses].sort((a, b) => {
    const getIndex = (id: string | number) => {
      const parts = String(id).split("_");
      return Number(parts[parts.length - 1]);
    };
    return getIndex(a.question_id) - getIndex(b.question_id);
  });

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


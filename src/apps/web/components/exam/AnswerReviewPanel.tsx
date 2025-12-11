import React from "react";
import type { AnswerSummary } from "@/lib/mock-tests";

const OPTIONS = ["A", "B", "C", "D"];

type Props = {
  totalQuestions: number;
  answers: AnswerSummary[];
};

export default function AnswerReviewPanel({ totalQuestions, answers }: Props) {
  // Map: question number -> answer record
  const answerMap = React.useMemo(() => {
    const map = new Map<number, AnswerSummary>();
    for (const a of answers) {
      map.set(a.number, a);
    }
    return map;
  }, [answers]);

  // Build a full list 1..N, filling unanswered with "-" and correct=false
  const items = React.useMemo(
    () =>
      Array.from({ length: totalQuestions }, (_, idx) => {
        const number = idx + 1;
        const record = answerMap.get(number);
        return {
          number,
          answer: record?.answer ?? "-",
          correct: record?.answer ? record.correct : false,
        };
      }),
    [answerMap, totalQuestions],
  );

  return (
    <aside className="flex h-full w-72 flex-col rounded-md border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b px-4 py-2">
        <h2 className="text-sm font-semibold text-slate-800">
          Đáp án đã chọn
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Màu sắc thể hiện đúng / sai / chưa chọn.
        </p>
      </div>

      {/* Scrollable list – height is capped by parent via h-full */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {items.map((item) => (
          <div
            key={item.number}
            className="mb-3 flex items-center gap-3 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0"
          >
            <div className="w-12 text-right text-xs font-medium text-slate-600">
              Câu {item.number}
            </div>

            <div className="flex flex-1 items-center gap-2">
              {OPTIONS.map((opt) => {
                const isSelected = item.answer === opt;

                let stateClasses =
                  "bg-white border-slate-200 text-slate-500";

                // chưa chọn gì
                if (!isSelected && item.answer === "-") {
                  stateClasses =
                    "bg-slate-50 border-slate-200 text-slate-400";
                }
                // chọn và đúng ✅
                else if (isSelected && item.correct) {
                  stateClasses =
                    "bg-emerald-500 border-emerald-500 text-white";
                }
                // chọn và sai ❌
                else if (isSelected && !item.correct && item.answer !== "-") {
                  stateClasses =
                    "bg-rose-500 border-rose-500 text-white";
                }

                const title = !isSelected
                  ? "Chưa chọn"
                  : item.answer === "-"
                  ? "Chưa chọn"
                  : item.correct
                  ? "Đúng"
                  : "Sai";

                return (
                  <div
                    key={opt}
                    className={
                      "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold " +
                      stateClasses
                    }
                    title={title}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

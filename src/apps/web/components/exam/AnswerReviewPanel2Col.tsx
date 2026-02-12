"use client";

import React from "react";

export type AnswerReviewRow = {
  number: number;      // 1..N
  chosen: string;      // "A"|"B"|"C"|"D"|"-"
  correct: string;     // "A"|"B"|"C"|"D"|"-"
  isCorrect: boolean;  // chosen matches correct
};

type Props = {
  totalQuestions: number;
  rows: AnswerReviewRow[];
};

export default function AnswerReviewPanel2Col({ totalQuestions, rows }: Props) {
  const map = React.useMemo(() => {
    const m = new Map<number, AnswerReviewRow>();
    rows.forEach((r) => m.set(r.number, r));
    return m;
  }, [rows]);

  const items = React.useMemo(
    () =>
      Array.from({ length: totalQuestions }, (_, idx) => {
        const number = idx + 1;
        return (
          map.get(number) ?? {
            number,
            chosen: "-",
            correct: "-",
            isCorrect: false,
          }
        );
      }),
    [map, totalQuestions],
  );

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-800">Đáp án</h2>
        <p className="mt-1 text-xs text-slate-500">
          Trái: bạn chọn (đúng xanh lá, sai đỏ). Phải: đáp án đúng.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="mb-2 grid grid-cols-[56px_1fr_1fr] text-[11px] font-semibold text-slate-600">
          <div>Câu</div>
          <div>Đáp án bạn chọn</div>
          <div>Đáp án đúng</div>
        </div>

        {items.map((it) => {
          const chosen = it.chosen ?? "-";
          const correct = it.correct ?? "-";

          const chosenClass =
            chosen === "-"
              ? "bg-slate-50 text-slate-400 border-slate-200"
              : it.isCorrect
              ? "bg-emerald-500 text-white "
              : "bg-red-500 text-white"; 

          return (
            <div
              key={it.number}
              className="grid grid-cols-[56px_1fr_1fr] items-center gap-3 border-b border-slate-100 py-2 last:border-b-0"
            >
              <div className="text-xs font-medium text-slate-600">
                {it.number}
              </div>

              <div
                className={
                  "inline-flex w-10 items-center justify-center rounded-md border px-2 py-1 text-xs font-semibold " +
                  chosenClass
                }
                title={chosen === "-" ? "Chưa chọn" : it.isCorrect ? "Đúng" : "Sai"}
              >
                {chosen}
              </div>

              <div
                className="inline-flex w-10 items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                title="Đáp án đúng"
              >
                {correct}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

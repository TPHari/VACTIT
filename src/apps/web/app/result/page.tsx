"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { TESTS, TOTAL_QUESTIONS } from "@/lib/mock-tests";

export default function ResultsPage() {
  const router = useRouter();
  const [selectedTestId, setSelectedTestId] = useState(TESTS[0].id);
  const selectedTest = TESTS.find((t) => t.id === selectedTestId)!;

  // build 120 answers
  const allAnswers = Array.from({ length: TOTAL_QUESTIONS }, (_v, idx) => {
    const number = idx + 1;
    const found = selectedTest.answers.find((a) => a.number === number);
    return (
      found ?? {
        number,
        answer: "-",
        correct: false,
      }
    );
  });

  const totalCorrect = allAnswers.filter(
    (a) => a.answer !== "-" && a.correct
  ).length;

  return (
    // PAGE: normal document scroll, sidebar + content share height naturally
    <div className="flex min-h-screen bg-brand-bg">
      {/* Sidebar – not scroll-isolated anymore */}
      <Sidebar />

      {/* Right side */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <div className="px-6 pt-4 lg:px-8">
          <Topbar />
        </div>

        {/* Main 2-column layout */}
        <div className="flex px-6 pb-8 pt-4 lg:px-8">
          {/* ========== MIDDLE COLUMN ========== */}
          <div className="flex flex-1 flex-col border-r border-slate-200 pr-6">
            {/* Subjects + Tổng điểm */}
            <div className="flex gap-6 pb-4">
              {/* Subjects */}
              <div className="w-1/2">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-muted">
                  Môn thi
                </h2>
                <ul className="space-y-2 text-sm">
                  {selectedTest.subjects.map((subject) => (
                    <li
                      key={subject.id}
                      className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm"
                    >
                      <span className="font-medium text-brand-text">
                        {subject.title}
                      </span>
                      <span className="text-xs text-brand-muted">
                        {subject.correct}/{subject.total} câu đúng
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tổng điểm */}
              <div className="flex flex-1 flex-col justify-between rounded-card bg-white p-4 shadow-card">
                <div>
                  <p className="text-xs font-medium text-brand-muted">
                    Tổng điểm
                  </p>
                  <p className="mt-1 text-3xl font-bold text-brand-text">
                    {selectedTest.score}
                  </p>
                  <p className="mt-1 text-xs text-brand-muted">
                    Mục tiêu:{" "}
                    <span className="font-semibold text-brand-primary">
                      {selectedTest.targetScore}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-brand-muted">
                    Tỉ lệ đúng:{" "}
                    <span className="font-semibold text-brand-text">
                      {selectedTest.percent}%
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-brand-muted">
                    Số câu đúng:{" "}
                    <span className="font-semibold text-brand-text">
                      {totalCorrect}/{TOTAL_QUESTIONS}
                    </span>
                  </p>
                </div>
                <div className="mt-3 text-xs text-brand-muted">
                  <p>Thời gian làm bài: {selectedTest.duration}</p>
                  <p>Ngày thi: {selectedTest.date}</p>
                </div>
              </div>
            </div>

            {/* Phân tích + Lịch sử thi */}
            <div className="mt-4 space-y-4">
              {/* Phân tích */}
              <section className="rounded-card bg-white p-4 shadow-card">
                <header className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff4d6] text-sm">
                    ★
                  </div>
                  <h2 className="text-sm font-semibold text-brand-text">
                    Phân tích bài làm
                  </h2>
                </header>
                <p className="text-sm leading-relaxed text-brand-muted">
                  {selectedTest.analysis}
                </p>
              </section>

              {/* Lịch sử thi – max 4 rows visible, then scroll */}
              <section className="rounded-card bg-white p-4 shadow-card">
                <header className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm-center font-semibold text-brand-text">
                    Lịch sử thi
                  </h2>
                </header>

                <div className="mt-1 max-h-40 overflow-y-auto pr-1 text-xs">
                  <div className="grid grid-cols-[2fr_0.5fr_0.7fr_1fr_1.2fr] border-b border-slate-100 pb-2 font-semibold text-brand-muted">
                    <div className="text-center">Tên đề thi</div>
                    <div className="text-center">Điểm</div>
                    <div className="text-center">Thời gian</div>
                    <div className="text-center">Ngày thi</div>
                    <div className="text-center"></div>
                  </div>

                  {TESTS.map((test) => {
                    const isActive = test.id === selectedTestId;

                    return (
                      <div
                        key={test.id}
                        onClick={() => setSelectedTestId(test.id)}
                        className={`grid w-full grid-cols-[2fr_0.5fr_0.7fr_1fr_1.2fr] border-b border-slate-100 py-2 text-left transition cursor-pointer ${
                          isActive ? "rounded-md bg-[#eef4ff] font-semibold" : "bg-transparent"
                        }`}
                      >
                        <div className="text-center">{test.name}</div>
                        <div className="text-center">{test.score}</div>
                        <div className="text-center">{test.duration}</div>
                        <div className="text-center">{test.date}</div>
                        <div className="text-center">
                          <div
                            onClick={(e) => {
                              e.stopPropagation(); // don't override row selection
                              router.push(`/review/${test.id}`);
                            }}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Xem chi tiết
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </section>
            </div>
          </div>

          {/* ========== RIGHT COLUMN: Đáp án 120 câu ========== */}
          <div className="ml-6 flex w-[320px] flex-col border-b border-slate-200">
            <header className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-semibold text-brand-text">
                Đáp án 120 câu
              </h2>
              <p className="mt-1 text-xs text-brand-muted">
                Mỗi ô thể hiện một câu hỏi. Màu xanh: đúng, màu đỏ: sai, dấu
                &quot;-&quot; là chưa có đáp án.
              </p>
            </header>

            {/* Own scroll, but height is capped so it fits nicely in view */}
            <div className="mt-3 max-h-[460px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2 text-xs ">
                {allAnswers.map((item) => (
                  <div
                    key={item.number}
                    className="flex items-center justify-between rounded-full border border-slate-200 bg-white px-3 py-1.5"
                  >
                    <span className="text-[11px] text-brand-muted">
                      Câu {item.number}
                    </span>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold  ${
                        item.answer === "-"
                          ? "bg-red-500 text-white"
                          : item.correct
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {item.answer}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

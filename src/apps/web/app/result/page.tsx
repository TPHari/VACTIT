"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

// ---------- Mock data ----------
const TESTS = [
  {
    id: "test-4",
    name: "Đề thi nền tảng số 4",
    score: 800,
    targetScore: 1100,
    percent: 75,
    duration: "60:00",
    date: "12.04.2025",
    analysis:
      "Bạn đã đạt mức điểm khá, đặc biệt là ở phần Tư duy khoa học. Vẫn còn một số câu sai ở phần Ngôn ngữ, chủ yếu liên quan đến từ vựng học thuật và suy luận ngữ cảnh.",
    subjects: [
      { id: "vietnamese", title: "Tiếng Việt", correct: 30, total: 30 },
      { id: "english", title: "Tiếng Anh", correct: 30, total: 30 },
      { id: "math", title: "Toán", correct: 30, total: 30 },
      { id: "logic", title: "Tư duy khoa học", correct: 30, total: 30 },
    ],
    answers: [
      { number: 1, answer: "A", correct: true },
      { number: 2, answer: "C", correct: true },
      { number: 3, answer: "E", correct: false },
      { number: 4, answer: "B", correct: true },
      { number: 5, answer: "A", correct: true },
      { number: 6, answer: "C", correct: true },
      { number: 7, answer: "D", correct: false },
    ],
  },
  {
    id: "test-3",
    name: "Đề thi nền tảng số 3",
    score: 750,
    targetScore: 1100,
    percent: 68,
    duration: "120:00",
    date: "03.03.2025",
    analysis:
      "Kết quả cho thấy phần Toán còn khá nhiều câu sai ở dạng bài đọc biểu đồ và bài toán suy luận. Ngôn ngữ và Tư duy khoa học ở mức ổn định.",
    subjects: [
      { id: "vietnamese", title: "Tiếng Việt", correct: 28, total: 30 },
      { id: "english", title: "Tiếng Anh", correct: 27, total: 30 },
      { id: "math", title: "Toán", correct: 25, total: 30 },
      { id: "logic", title: "Tư duy khoa học", correct: 26, total: 30 },
    ],
    answers: [
      { number: 1, answer: "B", correct: false },
      { number: 2, answer: "C", correct: true },
      { number: 3, answer: "D", correct: true },
      { number: 4, answer: "A", correct: true },
      { number: 5, answer: "E", correct: false },
      { number: 6, answer: "B", correct: true },
      { number: 7, answer: "C", correct: true },
    ],
  },
  {
    id: "test-2",
    name: "Đề thi nền tảng số 2",
    score: 900,
    targetScore: 1100,
    percent: 82,
    duration: "90:00",
    date: "20.02.2025",
    analysis:
      "Đây là một trong những bài có kết quả tốt nhất, đặc biệt là phần Ngôn ngữ. Tuy nhiên vẫn còn một số câu khó ở Tư duy khoa học.",
    subjects: [
      { id: "vietnamese", title: "Tiếng Việt", correct: 29, total: 30 },
      { id: "english", title: "Tiếng Anh", correct: 30, total: 30 },
      { id: "math", title: "Toán", correct: 29, total: 30 },
      { id: "logic", title: "Tư duy khoa học", correct: 28, total: 30 },
    ],
    answers: [
      { number: 1, answer: "A", correct: true },
      { number: 2, answer: "B", correct: true },
      { number: 3, answer: "C", correct: true },
      { number: 4, answer: "D", correct: true },
      { number: 5, answer: "E", correct: true },
      { number: 6, answer: "A", correct: true },
      { number: 7, answer: "B", correct: false },
    ],
  },
  {
    id: "test-1",
    name: "Đề thi nền tảng số 1",
    score: 850,
    targetScore: 1100,
    percent: 77,
    duration: "120:00",
    date: "01.02.2025",
    analysis:
      "Bài thi đầu tiên cho thấy nền tảng tương đối tốt. Các sai sót chủ yếu đến từ việc quản lý thời gian và đọc chưa kỹ đề.",
    subjects: [
      { id: "vietnamese", title: "Tiếng Việt", correct: 27, total: 30 },
      { id: "english", title: "Tiếng Anh", correct: 28, total: 30 },
      { id: "math", title: "Toán", correct: 27, total: 30 },
      { id: "logic", title: "Tư duy khoa học", correct: 26, total: 30 },
    ],
    answers: [
      { number: 1, answer: "C", correct: true },
      { number: 2, answer: "D", correct: true },
      { number: 3, answer: "E", correct: true },
      { number: 4, answer: "B", correct: false },
      { number: 5, answer: "A", correct: true },
      { number: 6, answer: "C", correct: true },
      { number: 7, answer: "D", correct: true },
    ],
  },
];

const TOTAL_QUESTIONS = 120;

export default function ResultsPage() {
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
                  <h2 className="text-sm font-semibold text-brand-text">
                    Lịch sử thi
                  </h2>
                </header>

                <div className="mt-1 max-h-[220px] overflow-y-auto pr-1 text-xs">
                  <div className="grid grid-cols-[2fr_0.7fr_1fr_1fr] border-b border-slate-100 pb-2 font-semibold text-brand-muted">
                    <div>Tên đề thi</div>
                    <div className="text-center">Điểm</div>
                    <div className="text-center">Thời gian</div>
                    <div className="text-center">Ngày thi</div>
                  </div>

                  {TESTS.map((test) => {
                    const isActive = test.id === selectedTestId;
                    return (
                      <button
                        key={test.id}
                        type="button"
                        onClick={() => setSelectedTestId(test.id)}
                        className={`grid w-full grid-cols-[2fr_0.7fr_1fr_1fr] border-b border-slate-100 py-2 text-left transition ${
                          isActive
                            ? "rounded-md bg-[#eef4ff] font-semibold"
                            : "bg-transparent"
                        }`}
                      >
                        <div>{test.name}</div>
                        <div className="text-center">{test.score}</div>
                        <div className="text-center">{test.duration}</div>
                        <div className="text-center">{test.date}</div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>

          {/* ========== RIGHT COLUMN: Đáp án 120 câu ========== */}
          <div className="ml-6 flex w-[320px] flex-col">
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
              <div className="grid grid-cols-2 gap-2 text-xs">
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
                          ? "bg-slate-100 text-slate-400"
                          : item.correct
                          ? "bg-brand-primary text-white"
                          : "bg-brand-danger text-white"
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

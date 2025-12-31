"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api-client";
import Loading from "@/components/ui/LoadingSpinner";
import Link from "next/link";

import type { TrialDetails, TrialListItem, StudentTrialsRes } from "./_types";
import { TOTAL_QUESTIONS } from "./_types";
import {
  formatDateVN,
  formatDurationMMSS,
  computeAllAnswers,
  inferSubjectsFromRawScore,
  inferTotalCorrectFromRawScore,
  renderOverallScore,
} from "./_utils";


export default function ResultsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trials, setTrials] = useState<TrialListItem[]>([]);
  const [selectedTrialId, setSelectedTrialId] = useState<string>("");

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedTrialDetails, setSelectedTrialDetails] = useState<TrialDetails | null>(null);

  // 0) Load user
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/user");
        const data = await res.json();

        if (cancelled) return;

        if (data?.ok) {
          setUser(data.user);
        } else {
          setError(data?.message || "Failed to load user");
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to load user");
          setLoading(false);
        }
      }
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const studentId = user?.user_id;

  // 1) Load trials list
  useEffect(() => {
    // don't fetch until we actually have a studentId
    if (!studentId) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await api.trials.getByStudent(studentId);
        const data: StudentTrialsRes = res;

        if (cancelled) return;

        const list = data?.data || [];
        list.sort(
          (a, b) =>
            new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
        );

        setTrials(list);

        if (list.length > 0) {
          setSelectedTrialId(list[0].trial_id);
          // do NOT setLoading(false) here; details effect will end loading after details fetch
        } else {
          // critical: if no trials, details effect won't run, so stop loading here
          setSelectedTrialId("");
          setSelectedTrialDetails(null);
          setDetailsLoading(false);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to load trials");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  // 2) Load selected trial details (responses + question.correct_option + section)
  useEffect(() => {
    if (!selectedTrialId) return;

    let cancelled = false;

    async function loadDetails() {
      try {
        setDetailsLoading(true);
        setLoading(true);
        setError(null);

        const res = await api.trials.getDetails(selectedTrialId);
        const data: TrialDetails | null = res?.data ?? null;

        if (cancelled) return;
        setSelectedTrialDetails(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load trial details");
      } finally {
        if (!cancelled) {
          setDetailsLoading(false);
          setLoading(false);
        }
      }
    }

    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [selectedTrialId]);


  const selectedTrial = useMemo(
    () => trials.find((t) => t.trial_id === selectedTrialId) ?? null,
    [trials, selectedTrialId],
  );

  const allAnswers = useMemo(() => {
    if (!selectedTrialDetails) {
      return Array.from({ length: TOTAL_QUESTIONS }, (_, idx) => ({
        number: idx + 1,
        answer: "-",
        correct: false,
        section: "Unknown",
      }));
    }

    return computeAllAnswers(selectedTrialDetails.responses || [], TOTAL_QUESTIONS);
  }, [selectedTrialDetails]);

  const subjects = useMemo(
  () => inferSubjectsFromRawScore(selectedTrial?.raw_score),
  [selectedTrial?.raw_score],
);

  const totalCorrect = useMemo(
    () => inferTotalCorrectFromRawScore(selectedTrial?.raw_score),
    [selectedTrial?.raw_score],
  );

  // You can replace this with a real AI analysis later
  const analysisText = useMemo(() => {
    if (!selectedTrialDetails) return "Đang tải phân tích...";
    const t = selectedTrialDetails.tactic as any;
    return (t?.summary && String(t.summary).trim()) || "Chưa có dữ liệu phân tích.";
  }, [selectedTrialDetails]);


  if (loading || detailsLoading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-brand-bg px-6 py-6 text-sm text-red-600">
          Lỗi: {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!trials.length) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex justify-center text-sm">
          <p>
            Không có dữ liệu, bạn vui lòng{" "}
            <Link
              href="/exam"
              className="text-blue-600 hover:underline font-medium"
            >
              vào thi
            </Link>{" "}
            để có kết quả.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex min-h-screen bg-brand-bg">
        <div className="flex flex-1 flex-col">
          {/* Main 2-column layout */}
          <div className="flex px-6 pb-8 pt-4 lg:px-8">
            {/* ========== MIDDLE COLUMN ========== */}
            <div className="flex flex-1 flex-col border-r border-slate-200 pr-6">
              {/* Subjects + Tổng điểm */}
              <div className="flex gap-6 pb-4">
                {/* Subjects */}
                <div className="w-1/2">
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-muted">
                    Phần thi
                  </h2>

                  <ul className="space-y-2 text-sm">
                    {subjects.map((subject) => (
                      <li
                        key={subject.id}
                        className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm"
                      >
                        <span className="font-medium text-brand-text">
                          {subject.title}
                        </span>
                        <span className="text-xs text-brand-muted">
                          {subject.correct}/30 câu đúng
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tổng điểm */}
                <div className="flex flex-1 flex-col justify-between rounded-card rounded-xl bg-white p-4 shadow-card">
                  <p className="text-xs font-medium text-brand-muted text-center">
                    {selectedTrialDetails?.test.type === "exam" ?
                      "Tổng điểm (IRT)" : "Tổng điểm luyện tập"}
                  </p>

                  <p className="mt-1 text-5xl font-bold text-brand-text text-center">
                    {renderOverallScore(
                      selectedTrialDetails?.test.type === "exam",
                      selectedTrial?.raw_score,
                      selectedTrial?.processed_score
                    )}

                  </p>

                  <p className="mt-1 text-xs text-brand-muted text-center">
                    Số câu đúng:{" "}
                    <span className="font-semibold text-brand-text">
                      {totalCorrect}/{TOTAL_QUESTIONS}
                    </span>
                  </p>

                  {detailsLoading && (
                    <p className="mt-2 text-xs text-brand-muted">
                      Đang tải chi tiết bài làm...
                    </p>
                  )}

                </div>
              </div>

              {/* Phân tích + Lịch sử thi */}
              <div className="mt-4 space-y-4">
                {/* Phân tích */}
                <section className="rounded-card bg-white p-4 shadow-card rounded-xl">
                  <header className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff4d6] text-sm">
                      ★
                    </div>
                    <h2 className="text-sm font-semibold text-brand-text">
                      Phân tích bài làm
                    </h2>
                  </header>

                  <p className="text-sm leading-relaxed text-brand-muted">
                    {analysisText}
                  </p>
                </section>

                {/* Lịch sử thi – max 4 rows visible, then scroll */}
                <section className="rounded-card bg-white p-4 shadow-card rounded-xl">
                  <header className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm-center font-semibold text-brand-text">
                      Lịch sử thi
                    </h2>
                  </header>

                  <div className="mt-1 max-h-40 overflow-y-auto pr-1 text-xs">
                    <div className="grid grid-cols-[2fr_0.4fr_0.7fr_1.5fr_1fr] border-b border-slate-100 pb-2 font-semibold text-brand-muted">
                      <div className="text-center">Tên đề thi</div>
                      <div className="text-center">Điểm</div>
                      <div className="text-center">Thời gian</div>
                      <div className="text-center">Ngày thi</div>
                      <div className="text-center"></div>
                    </div>

                    {trials.map((t) => {
                      const isActive = t.trial_id === selectedTrialId;

                      return (
                        <div
                          key={t.trial_id}
                          onClick={() => setSelectedTrialId(t.trial_id)}
                          className={`grid w-full grid-cols-[2fr_0.4fr_0.7fr_1.5fr_1fr]
                          items-center
                          border-b border-slate-100 py-2 text-left transition cursor-pointer
                          ${isActive
                            ? "rounded-md bg-[#eef4ff] font-semibold"
                            : "bg-transparent"
                          }`}

                        >
                          <div className="text-center">{t.test?.title ?? t.test_id}</div>
                          <div className="text-center">
                            {renderOverallScore(t.test?.type === "exam", t.raw_score, t.processed_score)}
                          </div>
                          <div className="text-center">
                            {t.test?.duration != null ? formatDurationMMSS(t.test.duration) : "-"}
                          </div>
                          <div className="text-center">{formatDateVN(t.start_time)}</div>
                          <div className="text-center">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/review/trial/${t.trial_id}`);
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
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${item.answer === "-"
                          ? "bg-gray-200 text-gray-500"
                          : item.correct
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          }`}
                        title={
                          item.answer === "-"
                            ? "Chưa chọn"
                            : item.correct
                              ? "Đúng"
                              : "Sai"
                        }
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
    </DashboardLayout>
  );
}

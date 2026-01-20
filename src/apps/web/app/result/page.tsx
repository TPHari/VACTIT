"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api-client";
import Loading from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import Image from "next/image";

import type { TrialDetails, TrialListItem, StudentTrialsRes } from "./_types";
import { TOTAL_QUESTIONS } from "./_types";
import {
  formatDateVN,
  formatDurationMMSS,
  computeAllAnswers,
  inferSubjectsFromRawScore,
  inferTotalCorrectFromRawScore,
  renderOverallScore,
  attachIrtScores,
  pickSubjectAdvice,
} from "./_utils";

// Color palette
const COLORS = {
  blue: "#2864D2",
  yellow: "#FFD700",
  red: "#CE3838",
  gray: "#9CA3AF",
};

// Section card colors mapping
const SECTION_COLORS: Record<string, string> = {
  language: COLORS.red,
  literature: COLORS.red,
  math: COLORS.blue,
  science: COLORS.yellow,
};

export default function ResultsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trials, setTrials] = useState<TrialListItem[]>([]);
  const [selectedTrialId, setSelectedTrialId] = useState<string>("");

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedTrialDetails, setSelectedTrialDetails] =
    useState<TrialDetails | null>(null);

  // State for expanded section analysis - multiple cards can be expanded
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // State for analysis modal
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const toggleSectionAnalysis = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

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

    return computeAllAnswers(
      selectedTrialDetails.responses || [],
      TOTAL_QUESTIONS,
    );
  }, [selectedTrialDetails]);

  const isExam = selectedTrial?.test?.type === "exam";

  const subjects = useMemo(() => {
    const base = inferSubjectsFromRawScore(selectedTrial?.raw_score);
    if (!isExam) return base;
    return attachIrtScores(base, selectedTrial?.processed_score);
  }, [isExam, selectedTrial?.raw_score, selectedTrial?.processed_score]);

  const totalCorrect = useMemo(
    () => inferTotalCorrectFromRawScore(selectedTrial?.raw_score),
    [selectedTrial?.raw_score],
  );

  const subjectAnalyses = useMemo(() => {
    return subjects.map((subject) => {
      const rawScore = subject.score0_300 ?? subject.correct * 10;
      const score = Number.isFinite(rawScore)
        ? Math.round(Number(rawScore))
        : null;
      return {
        id: subject.id,
        title: subject.title,
        correct: subject.correct,
        score,
        advice: pickSubjectAdvice(subject.id, score),
        hasIrtScore: subject.score0_300 != null,
      };
    });
  }, [subjects]);

  // You can replace this with a real AI analysis later
  const tacticSummary = useMemo(() => {
    if (!selectedTrialDetails) return "Đang tải phân tích...";
    const t = selectedTrialDetails.tactic as any;
    return (
      (t?.summary && String(t.summary).trim()) || "Chưa có dữ liệu phân tích."
    );
  }, [selectedTrialDetails]);

  const hasAdditionalSummary = useMemo(
    () =>
      tacticSummary &&
      !["Đang tải phân tích...", "Chưa có dữ liệu phân tích."].includes(
        tacticSummary,
      ),
    [tacticSummary],
  );

  if (loading || detailsLoading) {
    return <Loading />;
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
          {/* Main layout */}
          <div className="flex flex-col px-4 pb-6 pt-3 lg:px-6 gap-4">
            {/* ========== TOP ROW: Tổng điểm (left) + Điểm từng phần (right) ========== */}
            <div className="flex gap-4">
              {/* Tổng điểm + Tổng điểm năng lực - Left side */}
              <div className="w-[580px] flex-shrink-0">
                <div className="rounded-2xl bg-white p-5 shadow-sm h-full flex flex-col">
                  {/* Tổng điểm năng lực - Top row: Icon - Label - Score */}
                  <div className="flex items-center justify-center gap-3 py-4 mb-4 border-b border-slate-100">
                    <Image
                      src="/assets/logos/total_score.png"
                      alt="Total Score"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                    <p className="text-xl text-brand-muted">
                      {isExam ? "Tổng điểm năng lực:" : "Tổng điểm năng lực quy đổi:"}
                    </p>
                    <p className="text-6xl font-bold text-brand-text">
                      {renderOverallScore(
                        selectedTrialDetails?.test.type === "exam",
                        selectedTrial?.raw_score,
                        selectedTrial?.processed_score,
                      )}
                    </p>
                  </div>

                  <h2 className="text-lg font-bold text-brand-text mb-1 line-clamp-2">
                    {selectedTrial?.test?.title ?? "Kết quả bài thi"}
                  </h2>
                  <p className="text-xs text-brand-muted mb-3">Điểm tổng</p>
                  
                  <div className="flex items-start gap-5 mb-4">
                    {/* Circular score display */}
                    <div className="relative flex-shrink-0">
                      <svg className="w-[90px] h-[90px] transform -rotate-90">
                        <circle
                          cx="45"
                          cy="45"
                          r="38"
                          stroke="#E5E7EB"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="45"
                          cy="45"
                          r="38"
                          stroke={COLORS.yellow}
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(totalCorrect / TOTAL_QUESTIONS) * 239} 239`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-brand-text">{totalCorrect}</span>
                        <span className="text-[10px] text-brand-muted">/{TOTAL_QUESTIONS}</span>
                      </div>
                    </div>

                    {/* Section progress bars */}
                    <div className="flex-1 space-y-2 pt-1">
                      {subjects.map((subject) => (
                        <div key={subject.id} className="flex items-center gap-2">
                          <span className="text-xs text-brand-muted w-[65px] truncate">{subject.title}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(subject.correct / 30) * 100}%`,
                                backgroundColor: subject.id === 'vie' ? COLORS.red : 
                                                subject.id === 'eng' ? COLORS.yellow :
                                                subject.id === 'math' ? '#CBD5E1' : COLORS.blue
                              }}
                            />
                          </div>
                          <span className="text-xs text-brand-muted w-[32px] text-right">{subject.correct}/30</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAnalysisModal(true)}
                    className="w-full py-3 rounded-xl text-sm font-medium text-white transition-colors mt-auto"
                    style={{ backgroundColor: COLORS.blue }}
                  >
                    Phân tích chi tiết
                  </button>
                </div>
              </div>

              {/* Điểm từng phần - Right */}
              <div className="flex gap-2 flex-1">
                {subjectAnalyses.map((subject, index) => {
                  // Background images for each subject
                  const bgImages = [
                    "/assets/background/vi_card.png",
                    "/assets/background/eng_card.png", 
                    "/assets/background/math_card.png",
                    "/assets/background/sci_card.png"
                  ];
                  const bgImage = bgImages[index % bgImages.length];
                  
                  // Text colors per subject:
                  // Tiếng Việt: white
                  // Tiếng Anh: blue
                  // Toán: red
                  // Tư duy khoa học: yellow
                  const textColors = ["#FFFFFF", COLORS.blue, COLORS.red, COLORS.yellow];
                  const mainTextColor = textColors[index % textColors.length];
                  
                  // Sub text slightly transparent version of main color
                  const subTextOpacity = index === 0 ? "text-white/70" : 
                                        index === 1 ? "text-blue-600/70" :
                                        index === 2 ? "text-red-600/70" : "text-yellow-400/70";

                  return (
                    <div
                      key={subject.id}
                      className="flex-1 rounded-2xl px-4 py-5 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
                      style={{ 
                        backgroundImage: `url(${bgImage})`,
                      }}
                    >
                      <p className={`text-base font-bold ${subTextOpacity} mb-1`}>
                        {subject.hasIrtScore ? "Năng lực" : "Năng lực quy đổi"}
                      </p>
                      <h3 className="text-2xl font-bold text-center mb-3 leading-tight" style={{ color: mainTextColor }}>
                        {subject.title}
                      </h3>
                      <p className="text-6xl font-bold" style={{ color: mainTextColor }}>
                        {subject.score ?? subject.correct * 10}
                      </p>
                      <p className={`text-base font-bold ${subTextOpacity} mt-2`}>
                        trên 300
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========== BOTTOM ROW: 2 columns ========== */}
            <div className="flex gap-4">
              {/* Đáp án 120 câu - Left */}
              <div className="w-[800px] flex-shrink-0">
                <div className="rounded-2xl bg-white p-5 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-brand-text">
                      Đáp án 120 câu
                    </h2>
                    <button
                      onClick={() => router.push(`/review/trial/${selectedTrialId}`)}
                      className="text-sm font-medium hover:underline"
                      style={{ color: COLORS.blue }}
                    >
                      Xem chi tiết →
                    </button>
                  </div>
                  <p className="text-xs text-brand-muted mb-3">
                    Màu xanh: đúng, màu đỏ: sai, dấu &quot;-&quot; là chưa chọn
                  </p>
                  
                  <div className="max-h-[350px] overflow-y-auto pr-1">
                    <div className="grid grid-cols-10 gap-1">
                      {allAnswers.slice(0, 120).map((item) => (
                        <div
                          key={item.number}
                          className="flex flex-col items-center"
                        >
                          <span className="text-[8px] text-brand-muted mb-0.5">
                            {item.number}
                          </span>
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                            style={{
                              backgroundColor:
                                item.answer === "-"
                                  ? COLORS.gray
                                  : item.correct
                                    ? COLORS.blue
                                    : COLORS.red,
                            }}
                          >
                            {item.answer}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lịch sử thi - Right */}
              <div className="flex-1">
                <section className="rounded-2xl bg-white p-5 shadow-sm h-full">
                  <h2 className="text-xl font-bold text-brand-text mb-4">
                    Lịch sử thi
                  </h2>

                  <div className="max-h-[350px] overflow-y-auto pr-1">
                    <div className="grid grid-cols-[0.8fr_2fr_1fr] border-b border-slate-100 pb-2 font-semibold text-brand-muted text-xs">
                      <div className="text-center">Điểm</div>
                      <div>Tên Quiz</div>
                      <div className="text-center">Ngày làm</div>
                    </div>

                    {trials.map((t) => {
                      const isActive = t.trial_id === selectedTrialId;

                      return (
                        <div
                          key={t.trial_id}
                          onClick={() => setSelectedTrialId(t.trial_id)}
                          className={`grid w-full grid-cols-[0.8fr_2fr_1fr]
                          items-center
                          border-b border-slate-100 py-2.5 transition cursor-pointer text-xs
                          ${
                            isActive
                              ? "rounded-lg bg-[#eef4ff] font-semibold"
                              : "bg-transparent hover:bg-slate-50"
                          }`}
                        >
                          <div className="text-center">
                            {inferTotalCorrectFromRawScore(t.raw_score)}/{TOTAL_QUESTIONS}
                          </div>
                          <div className="truncate pr-2">
                            {t.test?.title ?? t.test_id}
                          </div>
                          <div className="text-center">
                            {formatDateVN(t.start_time).split(" ")[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-[90%] max-w-3xl max-h-[80vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-brand-text">Phân tích chi tiết</h2>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="space-y-4">
                {subjectAnalyses.map((subject, index) => {
                  const colors = [COLORS.red, COLORS.yellow, "#94A3B8", COLORS.blue];
                  const bgColor = colors[index % colors.length];
                  
                  return (
                    <div
                      key={subject.id}
                      className="rounded-xl p-4 border border-slate-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-3 h-8 rounded"
                          style={{ backgroundColor: bgColor }}
                        />
                        <div>
                          <h3 className="font-semibold text-brand-text">{subject.title}</h3>
                          <p className="text-sm text-brand-muted">
                            {subject.correct}/30 câu đúng
                            {subject.score != null && ` · ${subject.score} điểm`}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-brand-muted leading-relaxed pl-6">
                        {subject.advice
                          ? subject.advice.split("\n").map((line, idx, arr) => (
                              <span key={idx}>
                                {line}
                                {idx < arr.length - 1 && <br />}
                              </span>
                            ))
                          : "Chưa có dữ liệu lời khuyên cho phần thi này."}
                      </p>
                    </div>
                  );
                })}

                {hasAdditionalSummary && (
                  <div className="rounded-xl p-4 border border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-brand-text mb-2">Ghi chú thêm</h3>
                    <p className="text-sm text-brand-muted leading-relaxed">
                      {tacticSummary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

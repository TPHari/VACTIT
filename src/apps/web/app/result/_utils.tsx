import type { SubjectSummary, TrialDetails } from "./_types";

export function formatDateVN(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hour = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} ${hour}:${min}`;
}

export function formatDurationMMSS(seconds: number | null | undefined) {
  if (!seconds || seconds <= 0) return "-";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function computeAllAnswers(
  responses: TrialDetails["responses"],
  totalQuestions: number,
) {
  const sorted = [...responses].sort((a, b) => {
    const getIndex = (id: string | number) => {
      const parts = String(id).split("_");
      return Number(parts[parts.length - 1]);
    };
    return getIndex(a.question_id) - getIndex(b.question_id);
  });

  const base = sorted.map((r, idx) => {
    const number = idx + 1;
    const chosen = r.chosen_option ?? "-";
    const correctOpt = r.question?.correct_option ?? null;

    return {
      number,
      answer: chosen,
      correct: chosen !== "-" && correctOpt !== null && chosen === correctOpt,
    };
  });

  return Array.from({ length: totalQuestions }, (_, idx) => {
    const number = idx + 1;
    return (
      base.find((a) => a.number === number) ?? {
        number,
        answer: "-",
        correct: false,
      }
    );
  });
}


export function safeJsonb(x: any) {
  if (x == null) return null;
  if (typeof x === "string") {
    try { return JSON.parse(x); } catch { return null; }
  }
  return x;
}

// subjects ALWAYS inferred from raw_score ONLY
export function inferSubjectsFromRawScore(rawScore: any): SubjectSummary[] {
  const s: any = safeJsonb(rawScore) || {};
  const n = (k: string) => (Number.isFinite(Number(s?.[k])) ? Number(s[k]) : 0);

  return [
    { id: "vie", title: "Tiếng Việt", correct: n("Vie_score") },
    { id: "eng", title: "Tiếng Anh", correct: n("Eng_score") },
    { id: "math", title: "Toán học", correct: n("Mth_score") },
    { id: "sci", title: "Tư duy khoa học", correct: n("Sci_score") },
  ];
}

export function inferTotalCorrectFromRawScore(rawScore: any) {
  const s: any = safeJsonb(rawScore);
  if (typeof s?.total === "string" && s.total.includes("/")) {
    const left = Number(s.total.split("/")[0]);
    if (Number.isFinite(left)) return left;
  }
  return inferSubjectsFromRawScore(rawScore).reduce((a, b) => a + b.correct, 0);
}

// overall score: raw => correct*10, processed => sum score0_300_* and round
export function renderOverallScore(isExam: boolean, rawScore: any, processedScore: any) {
  if (!isExam) {
    const correct = inferTotalCorrectFromRawScore(rawScore);
    return String(correct * 10);
  }

  const p: any = safeJsonb(processedScore);
  if (!p || typeof p !== "object") return "0";

  const keys = ["score0_300_en", "score0_300_vi", "score0_300_sci", "score0_300_math"];
  const sum = keys.reduce((acc, k) => {
    const v = Number(p[k]);
    return Number.isFinite(v) ? acc + Math.round(v) : acc;
  }, 0);

  return String(sum);
}


export function attachIrtScores(subjects: SubjectSummary[], processedScore: any) {
  const p: any = safeJsonb(processedScore);
  if (!p || typeof p !== "object") return subjects;

  const map: Record<string, string> = {
    vie: "score0_300_vi",
    eng: "score0_300_en",
    math: "score0_300_math",
    sci: "score0_300_sci",
  };

  return subjects.map((s) => {
    const key = map[s.id];
    if (!key) return s;

    const v = Number(p[key]);
    if (!Number.isFinite(v)) return s;

    return { ...s, score0_300: Math.round(v) }; 
  });
}

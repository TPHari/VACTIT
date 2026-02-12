"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ViewerPane from "@/components/exam/ViewerPane";
import AnswerReviewPanel2Col from "@/components/exam/AnswerReviewPanel2Col";
import { buildAnswerReviewRows } from "@/lib/adapters/answers";
import { api } from "@/lib/api-client";
import Loading from "@/components/ui/LoadingSpinner";

const TOTAL_QUESTIONS = 120; // or compute from test/sections if you have that

type TrialDetails = {
  trial_id: string;
  test: { test_id: string; title: string; duration: number | null };
  responses: Array<{
    question_id: string;
    chosen_option: string | null;
    response_time: number;
    question?: { correct_option: string | null };
  }>;
};

export default function ReviewPage({ params }: { params: Promise<{ trialId: string }> }) {
  const { trialId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [trial, setTrial] = useState<TrialDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [pages, setPages] = useState<string[]>([]);
  const [zoom] = useState(1);
  const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Fetch trial details + pages at the same time
        const [trialRes, pagesRes] = await Promise.all([
          api.trials.getDetails(trialId),
          fetch(`${BACKEND}/api/exam/${trialId}/pages`),
        ]);

        if (cancelled) return;

        const trialData: TrialDetails | null = trialRes?.data ?? null;
        if (!trialData) {
          setTrial(null);
          setPages([]);
          return;
        }
        setTrial(trialData);

        // 2) Parse pages JSON safely
        if (!pagesRes.ok) {
          const txt = await pagesRes.text();
          throw new Error(`Pages API ${pagesRes.status}: ${txt}`);
        }

        const ct = pagesRes.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const txt = await pagesRes.text();
          throw new Error(`Pages API non-JSON (${ct}): ${txt}`);
        }

        const pagesJson = await pagesRes.json();
        setPages(pagesJson.pages || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load review data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [trialId, BACKEND]);

  if (loading) return <Loading />;
  if (error) return <div className="px-6 py-4 text-sm text-red-600">Lỗi: {error}</div>;
  if (!trial) return <div className="px-6 py-4 text-sm">Không có dữ liệu</div>;

  const rows = buildAnswerReviewRows(trial.responses);

  return (
    <main className="h-screen px-4 pb-4 pt-3 lg:px-6">
      <div className="flex h-full min-h-0 flex-col">
        <div className="mb-3 flex items-center gap-4">
          <button
            onClick={() => router.push("/result")}
            className="flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <h1 className="text-base font-semibold">{trial.test.title} - Review</h1>
        </div>

        <div className="flex min-h-0 flex-1 flex-row gap-4 overflow-hidden">
          <ViewerPane pages={pages} zoom={zoom} />

          <div className="h-full min-h-0 w-80">
            <AnswerReviewPanel2Col totalQuestions={TOTAL_QUESTIONS} rows={rows} />
          </div>
        </div>
      </div>
    </main>
  );
}

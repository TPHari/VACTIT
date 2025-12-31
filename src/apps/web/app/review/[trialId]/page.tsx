"use client";

import { useEffect, useState } from "react";
import ViewerPane from "@/components/exam/ViewerPane";
import AnswerReviewPanel2Col from "@/components/exam/AnswerReviewPanel2Col";
import { buildAnswerReviewRows } from "@/lib/adapters/answers";
import { api } from "@/lib/api-client";
import Loading from "@/components/ui/LoadingSpinner";
import { use } from "react";

const TOTAL_QUESTIONS = 120; // or compute from test/sections if you have that

type TrialDetails = {
  trial_id: string;
  test: { test_id: string; title: string; duration: number | null };
  responses: Array<{
    question_id: string;
    chosen_option: string | null;
    response_time: number;
    question?: { correct_option: string | null; section: string | null };
  }>;
};

export default function ReviewPage({ params }: { params: Promise<{ trialId: string }> }) {
  const { trialId } = use(params);

  const [loading, setLoading] = useState(true);
  const [trial, setTrial] = useState<TrialDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [pages, setPages] = useState<string[]>([]);
  const [zoom] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // 1) Fetch trial details (trial + responses + question.correct_option)
        const res = await api.trials.getDetails(trialId);
        const data: TrialDetails | null = res?.data ?? null;

        if (cancelled) return;

        if (!data) {
          setTrial(null);
          setPages([]);
          return;
        }

        setTrial(data);

        // 2) Load PDF pages for the test (you already had something like this)
        const testId = data.test.test_id;
        const pagesRes = await fetch(`/api/exam/${testId}/pages`);
        const pagesJson = await pagesRes.json();
        setPages(pagesJson.pages || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load review data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [trialId]);

  if (loading) return <Loading />;
  if (error) return <div className="px-6 py-4 text-sm text-red-600">Lỗi: {error}</div>;
  if (!trial) return <div className="px-6 py-4 text-sm">Không có dữ liệu</div>;

  const rows = buildAnswerReviewRows(trial.responses);

  return (
    <main className="px-6 pb-8 pt-4 lg:px-8">
      <h1 className="mb-3 text-base font-semibold">
        {trial.test.title} – Review
      </h1>

      <div className="flex h-[calc(100vh-0px)] gap-6">
        <div className="flex-2 rounded-md border bg-white shadow-sm">
          <ViewerPane pages={pages} zoom={zoom} />
        </div>

        <div className="flex-1 max-w-sm h-full">
          <AnswerReviewPanel2Col totalQuestions={TOTAL_QUESTIONS} rows={rows} />
        </div>
      </div>
    </main>
  );
}

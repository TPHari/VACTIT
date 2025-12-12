"use client";

import { useEffect, useState, use } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import ViewerPane from "@/components/exam/ViewerPane"; // reuse viewer
import AnswerReviewPanel from "@/components/exam/AnswerReviewPanel";
import { TESTS, TOTAL_QUESTIONS } from "@/lib/mock-tests";

export default function ReviewPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = use(params);

  const test = TESTS.find((t) => t.id === testId);
  const [pages, setPages] = useState<string[]>([]);
  const [zoom] = useState(1);

  useEffect(() => {
    async function loadPages() {
      const res = await fetch(`/api/exam/${testId}/pages`);
      const data = await res.json();
      setPages(data.pages || []);
    }
    loadPages();
  }, [testId]);

  if (!test) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm">Không tìm thấy đề thi</div>
      </div>
    );
  }

  return (
  <main className="px-6 pb-8 pt-4 lg:px-8">

    <h1 className="mb-3 text-base font-semibold">
      {test.name} – Xem lại bài làm
    </h1>

    <div className="flex gap-6 h-[calc(100vh-0px)]">
      {/* ViewerPane */}
      <div className="flex-2 rounded-md border bg-white shadow-sm">
        <ViewerPane pages={pages} zoom={zoom} />
      </div>

      {/* Answer panel */}
      <div className="flex-1 max-w-xs h-full">
        <AnswerReviewPanel
          totalQuestions={TOTAL_QUESTIONS}
          answers={test.answers}
        />
      </div>
    </div>

  </main>

);


}

'use client';

import React, { useEffect, useState } from 'react';
import ViewerPane from '@/components/exam/ViewerPane';
import Controls from '@/components/exam/Controls';
import AnswerPanel from '@/components/exam/AnswerPanel';
import { api } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

//Chức năng: Giao diện làm bài

// Định nghĩa types ngay đây hoặc import từ file types chung
export type Question = {
  id: number;
  text?: string;
  options: string[];
};

type ExamContainerProps = {
  testId: string;
  initialPages: string[]; // Data được truyền từ Server Component
  totalQuestions?: number;
  testTitle?: string;
  durationMinutes?: number;
  realTestId?: string; // The test_id from database (e.g. 1767...)
};

export default function ExamContainer({
  testId,
  initialPages,
  totalQuestions = 120,
  testTitle,
  durationMinutes,
  realTestId
}: ExamContainerProps) {
  // State
  const [zoom, setZoom] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Giả lập câu hỏi (hoặc nhận từ props nếu API trả về chi tiết câu hỏi)
  // Re-generate questions with correct IDs if realTestId is present?
  // Actually, UI uses 1..120. We only need to map at submission time.
  const questions: Question[] = Array.from({ length: totalQuestions }).map((_, i) => ({
    id: i + 1,
    text: undefined,
    options: ['A', 'B', 'C', 'D'],
  }));

  const testData = {
    title: testTitle || 'Đề thi thử ĐGNL',
    durationSeconds: (durationMinutes || 120) * 60,
    testId: testId,
  };

  // 1. Sync với LocalStorage khi component mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`exam_${testId}_answers`);
    const savedFlags = localStorage.getItem(`exam_${testId}_flags`);
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedFlags) setFlags(JSON.parse(savedFlags));
  }, [testId]);

  const router = useRouter();

  // 2. Logic Handlers
  function handleSelect(qid: number, value: string) {
    setAnswers((prev) => {
      const updated = { ...prev, [qid]: value };
      localStorage.setItem(`exam_${testId}_answers`, JSON.stringify(updated));
      return updated;
    });
  }

  function handleToggleFlag(qid: number) {
    setFlags((prev) => {
      const updated = { ...prev, [qid]: !prev[qid] };
      localStorage.setItem(`exam_${testId}_flags`, JSON.stringify(updated));
      return updated;
    });
  }

  async function submitAnswers(force = false) {
    if (!force) {
      setShowConfirmModal(true);
      return;
    }

    const trialId = testId;
    const responsesPayload = Object.entries(answers).map(([qid, chosen]) => ({
      questionId: realTestId ? `${realTestId}_${qid}` : String(qid),
      chosenOption: chosen ?? null,
      responseTime: 0,
    }));

    try {
      const res = await api.responses.create({
        trialId: trialId,
        responses: responsesPayload,
      });
      if (res.error) {
        alert('Lỗi khi nộp bài: ' + res.error);
        return;
      }

      localStorage.removeItem(`exam_${testId}_answers`);
      localStorage.removeItem(`exam_${testId}_flags`);

      setShowConfirmModal(false); // Close confirm modal if open

      if (force) {
        setShowSuccessModal(true);
      } else {
        setShowSuccessModal(true);
      }

      // router.push('/result'); // Removed immediate redirect
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối khi nộp bài');
    }
  }

  function handleSuccessRedirect() {
    router.push('/overview');
  }

  function handleExpire() {
    // alert('Hết giờ! Hệ thống đang tự động nộp bài.'); // Maybe remove alert if prefer modal
    // But alert is blocking.
    alert('Hết giờ! Hệ thống đang tự động nộp bài.');
    submitAnswers(true);
  }

  return (
    <div className="bg-white rounded-lg shadow px-4 h-full flex flex-col relative">
      <Controls
        startAt={Date.now()}
        testData={testData}
        onExpire={handleExpire}
      />

      <div className="flex flex-row gap-6 mt-2 flex-1 overflow-hidden">
        <ViewerPane pages={initialPages} zoom={zoom} />
        <AnswerPanel
          questions={questions}
          answers={answers}
          onSelect={handleSelect}
          onSubmit={() => submitAnswers(false)}
          onClear={() => {
            if (confirm("Bạn có chắc muốn xóa hết đáp án?")) {
              setAnswers({});
              localStorage.removeItem(`exam_${testId}_answers`);
            }
          }}
          flags={flags}
          onToggleFlag={handleToggleFlag}
        />
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="w-[400px] bg-white rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận nộp bài</h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn nộp bài thi? <br />
              Hãy kiểm tra kỹ các câu trả lời trước khi xác nhận.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                type="button"
              >
                Hủy
              </button>
              <button
                onClick={() => submitAnswers(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                type="button"
              >
                Đồng ý nộp bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="w-[400px] bg-white rounded-xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nộp bài thành công!</h3>
            <p className="text-gray-600 mb-8">
              Chúc mừng bạn đã hoàn thành bài thi.
            </p>

            <button
              onClick={handleSuccessRedirect}
              className="w-full px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all transform hover:scale-[1.02]"
              type="button"
            >
              Về trang tổng quan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
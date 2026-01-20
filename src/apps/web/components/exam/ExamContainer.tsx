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
  // Handling variables for Exit, and Expire events
  const [showExpireModal, setShowExpireModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  //Get test type for exit handling
  const [trialType, setTrialType] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.trials.getById(testId);
        setTrialType(res?.data?.test?.type);
      } catch {
        // ignore
      }
    })();
  }, [testId]);

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
    durationSeconds: (durationMinutes || 150) * 60,
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
  useEffect(() => {
    const state = { isExam: true };

    if (!history.state?.isExam) {
    history.pushState(state, '', window.location.href);
  } else {
    history.replaceState(state, '', window.location.href);
  }

    const onPopState = () => {
      setShowExitModal(true);
      history.pushState(state, '', window.location.href);
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log('trial type on before unload', trialType);  
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);
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
    const responsesPayload = questions.map((q) => ({
      questionId: realTestId ? `${realTestId}_${q.id}` : String(q.id),
      chosenOption: answers[q.id] ?? '-',
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
      sessionStorage.setItem(`exam_cleared_${testId}`, '1');
      localStorage.removeItem(`exam_${testId}_answers`);
      localStorage.removeItem(`exam_${testId}_flags`);
      localStorage.removeItem(`exam_${testId}_endtime`);
      

      setShowConfirmModal(false); // Close confirm modal if open
      setShowExpireModal(false);
      setShowExitModal(false);

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
    setShowExpireModal(true);
    submitAnswers(true);
  }
  async function handleExit() {
    setShowExitModal(true);
  }
  function cancelExpire() {
    setShowExpireModal(false);
  }

  async function confirmExitLeaveWithoutSubmit() {
    setShowExitModal(false);
    // clear local cache for this exam so user returns in clean state
    try {
      sessionStorage.setItem(`exam_cleared_${testId}`, '1');
      localStorage.removeItem(`exam_${testId}_endtime`);
      localStorage.removeItem(`exam_${testId}_answers`);
      localStorage.removeItem(`exam_${testId}_flags`);
    } catch (e) {
      // ignore storage errors
    }

    try {
      const type = trialType ?? (await api.trials.getById(testId))?.data?.test?.type;
      if (type === 'practice') {
        await api.trials.cleanup(testId);
      }
    } catch (err) {
      console.error('Failed to remove practice trial on exit:', err);
    }

    router.push('/exam');
  }
  function cancelExit() {
    setShowExitModal(false);
  }
  return (
    <div className="bg-white shadow px-4 h-full flex flex-col relative">
      <Controls
        startAt={Date.now()}
        testData={testData}
        onExpire={handleExpire}
        onExit={handleExit}
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
              Về trang chính
            </button>
          </div>
        </div>
      )}

       {/* Expire Modal */}
      {showExpireModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="w-[420px] bg-white rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hết giờ</h3>
            <p className="text-sm text-gray-600 mb-6">Thời gian làm bài đã kết thúc. Hệ thống sẽ tự động nộp bài cho bạn.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelExpire}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-yellow-500 hover:bg-gray-200 rounded-lg"
                type="button"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[420px] bg-white rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Thoát khỏi bài thi</h3>
            <p className="text-sm text-gray-600 mb-6">Bạn chưa nộp bài, nếu rời đi bạn sẽ mất tất cả các câu trả lời đã điền.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelExit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                type="button"
              >
                Ở lại
              </button>
              <button
                onClick={confirmExitLeaveWithoutSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-700 rounded-lg"
                type="button"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
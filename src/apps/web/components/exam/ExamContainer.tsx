'use client';

import React, { useEffect, useState} from 'react';
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
};

export default function ExamContainer({
  testId,
  initialPages,
  totalQuestions = 120
}: ExamContainerProps) {
  // State
  const [zoom, setZoom] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  
  // Giả lập câu hỏi (hoặc nhận từ props nếu API trả về chi tiết câu hỏi)
  const questions: Question[] = Array.from({ length: totalQuestions }).map((_, i) => ({
    id: i + 1,
    text: undefined,
    options: ['A', 'B', 'C', 'D'],
  }));

  const testData = {
    title: 'Đề thi thử ĐGNL',
    durationSeconds: 150 * 60, // 150 phút
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

  async function submitAnswers() {
    // Xóa storage trước hoặc sau khi submit thành công tùy logic business
    // Ở đây tôi giữ lại để đề phòng lỗi mạng
    
  const trialId = testId; // if you navigate to /exam/<trialId>, pass it as testId prop
    const responsesPayload = Object.entries(answers).map(([qid, chosen]) => ({
      questionId: String(qid),
      chosenOption: chosen ?? null,
      responseTime: 0, // replace with real timing if you collect it
    }));

    try {
      const res =  await api.responses.create({
        trialId: trialId,
        responses: responsesPayload,
      });
      if (res.error) {
        alert('Lỗi khi nộp bài: ' + res.error);
        return;
      }

      // Clear storage when successful
      localStorage.removeItem(`exam_${testId}_answers`);
      localStorage.removeItem(`exam_${testId}_flags`);
      alert('Nộp bài thành công!');
      // optional: redirect to results page
      router.push('/result');
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối khi nộp bài');
    }
  }

  function handleExpire() {
    alert('Hết giờ! Hệ thống đang tự động nộp bài.');
    submitAnswers();
  }

  return (
    <div className="bg-white rounded-lg shadow px-4 h-full flex flex-col">
      <Controls
        startAt={Date.now()}
        testData={testData}
        onExpire={handleExpire}
      />

      <div className="flex flex-row gap-6 mt-2 flex-1 overflow-hidden">
        {/* Truyền pages từ Server Component vào đây */}
        <ViewerPane pages={initialPages} zoom={zoom} />
        
        <AnswerPanel
          questions={questions}
          answers={answers}
          onSelect={handleSelect}
          onSubmit={submitAnswers}
          onClear={() => {
             if(confirm("Bạn có chắc muốn xóa hết đáp án?")) {
                setAnswers({});
                localStorage.removeItem(`exam_${testId}_answers`);
             }
          }}
          flags={flags}
          onToggleFlag={handleToggleFlag}
        />
      </div>
    </div>
  );
}
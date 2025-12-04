'use client';

import React, { useEffect, useState } from 'react';
import ViewerPane from '@/components/exam/ViewerPane';
import Controls from '@/components/exam/Controls';
import AnswerPanel from '@/components/exam/AnswerPanel';

type Question = {
  id: number;
  text?: string;
  options: string[];
};

type Params = Promise<{ testId: string }>

export default function ExamPage(props: {
  params: Params;
} ) {
  const params = React.use(props.params)
  const testId = params.testId
  const [pages, setPages] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [questions, setQuestions] = useState<Question[]>([]);

  const testData = {
    title: 'Đề thi thử môn ABC',
    durationSeconds: 3600, 
    testId: testId,
  }


  useEffect(() => {
    setQuestions(
      Array.from({ length: 120 }).map((_, i) => ({
        id: i + 1,
        text: undefined,
        options: ['A', 'B', 'C', 'D'],
      }))
    );
  }, []);

  useEffect(() => {
   console.log(`Fetching pages for exam ${testId} from /api/exam/${testId}/pages`);
   fetch(`/api/exam/${testId}/pages`)
     .then(res => res.json())
     .then(data => {
       console.log('Fetched pages:', data);
       setPages(data.pages);
       setPageNumber(1);
       console.log(`Loaded ${data.pages.length} pages for exam ${testId}`);
     });
  }, [testId]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`exam_${testId}_answers`);
    const savedFlags = localStorage.getItem(`exam_${testId}_flags`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    if (savedFlags) {
      setFlags(JSON.parse(savedFlags));
    }
  }, [testId]);

  function handleSelect(qid: number, value: string) {
    setAnswers((answers) => {
      const updatedAnswers = { ...answers, [qid]: value };
      localStorage.setItem(`exam_${testId}_answers`, JSON.stringify(updatedAnswers));
      return updatedAnswers;
    }
    );
  }

  async function submitAnswers() {
  localStorage.removeItem(`exam_${testId}_answers`);
  localStorage.removeItem(`exam_${testId}_flags`);
  try {
    const res = await fetch('/api/exam/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testId, answers }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Failed: ${err.error}`);
      return;
    }

    alert('Submitted');
  } catch (err) {
    console.error(err);
    alert('Failed to submit');
  }
}

  function handleExpire() {
    alert('Time is up! Submitting your exam.');
    submitAnswers();
  }

  function handleToggleFlag(qid: number) {
    const newFlags = { ...flags, [qid]: !flags[qid] };
    setFlags(newFlags);
    localStorage.setItem(`exam_${testId}_flags`, JSON.stringify(newFlags));
  }
  return (
    <div className="min-h-screen flex">
        <main className="flex-1 overflow-auto">
          <div className="bg-white rounded-lg shadow px-4">
            <Controls
              startAt={Date.now()} // replace with actual start time
              testData={testData}
              onExpire={() => { handleExpire(); }}
            />

            <div className="flex flex-row gap-6 mt-2">
              <ViewerPane pages={pages} zoom={zoom} />
              <AnswerPanel
                questions={questions}
                answers={answers}
                onSelect={handleSelect}
                onSubmit={() => { submitAnswers(); }}
                onClear={() => setAnswers({})}
                flags={flags}
                onToggleFlag={(qid) => {
                  handleToggleFlag(qid);
                }}
              />
            </div>
          </div>
        </main>
    </div>
  );
}

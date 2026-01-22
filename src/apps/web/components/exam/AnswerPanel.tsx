import React from 'react';

type Question = { id: number; text?: string; options: string[] };

export default function AnswerPanel({
  questions,
  answers,
  onSelect,
  onSubmit,
  onClear,
  flags,
  onToggleFlag,
}: {
  questions: Question[];
  answers: Record<number, string>;
  onSelect: (qid: number, value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  flags?: Record<number, boolean>;
  onToggleFlag?: (qid: number) => void;
}) {
  return (
    <aside className="flex-1 min-w-[320px] max-w-[400px] bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
      {/* Header - Centered */}
      <div className="flex items-center justify-center gap-6 px-6 py-3 border-b border-gray-300">
        <span className="text-sm font-[650] text-gray-700">Điền đáp án</span>
        <button
          onClick={onSubmit}
          className="px-7 py-2 text-sm font-[450] text-black bg-[#F1F6FF] border border-gray-300 rounded-lg hover:bg-[#2864D2] hover:text-white  transition-colors cursor-pointer"
          aria-label="Nộp bài"
        >
          Nộp bài
        </button>
      </div>

      {/* Answer Grid - 3 Column Layout */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-1">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`grid grid-cols-[40px_1fr_40px] items-center px-4 py-2.5 ${
                (idx + 1) % 5 === 0 ? 'border-b border-gray-300' : ''
              }`}
            >
              {/* Column 1: Question Number */}
              <div className="text-center">
                <span className="text-sm text-black">{q.id}</span>
              </div>

              {/* Column 2: Options A, B, C, D */}
              <div className="flex items-center justify-center gap-6 px-4">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => onSelect(q.id, opt)}
                      aria-pressed={selected}
                      className={`flex items-center justify-center w-7 h-7 rounded-full border border-2 transition-all text-base cursor-pointer
                        ${selected
                          ? 'bg-[#2864D2] border-[#2864D2] text-white'
                          : 'bg-white border-[#2864D2] text-[#2864D2] hover:border-[#2864D2]'
                        }`}
                      title={`Câu ${q.id}: ${opt}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Column 3: Flag Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => onToggleFlag?.(q.id)}
                  aria-pressed={!!flags?.[q.id]}
                  className={`p-1 transition-colors cursor-pointer ${
                    flags?.[q.id] 
                      ? 'text-[#CE3838]' 
                      : 'text-black hover:text-[#FF8D28]'
                  }`}
                  title={flags?.[q.id] ? 'Đã đánh dấu' : 'Đánh dấu câu hỏi'}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill={flags?.[q.id] ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
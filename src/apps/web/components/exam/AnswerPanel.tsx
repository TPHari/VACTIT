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

  const divider = "border-b-2"
  return (
    <aside className="flex-1 w-64 lg:w-96 bg-white border rounded-md shadow-sm flex flex-col h-full">
      <div className="border-b flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <button className="py-1 rounded-full bg-white text-sm font-medium">Điền đáp án</button>
          </div>
          <div className="text-xs text-gray-400 ml-2"> </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSubmit}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
            aria-label="Nộp bài"
          >
            Nộp bài
          </button>
        </div>
      </div>

      <div className="px-4">
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {questions.map((q, idx) => (
            <div
             key={q.id}
             className={`px-1 py-3 flex items-center gap-4 ${((idx + 1) % 5 === 0 ? divider : '')}`}
           >
             <div className="shrink-0 text-sm text-gray-600 font-medium lg:pr-4 pr-2 text-right">
               {q.id}
             </div>
             <div className="flex-1">
               <div className="flex items-center gap-3">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => onSelect(q.id, opt)}
                        aria-pressed={selected}
                        className={`flex items-center justify-center w-7 h-7 lg:w-9 lg:h-9 rounded-full border transition-colors text-sm cursor-pointer 
                          ${(selected
                            ? 'bg-blue-600 border-blue-600 text-white shadow'
                            : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-100')
                        }`}
                        title={`Câu ${q.id}: ${opt}`}
                      >
                        <span className="text-xs font-semibold">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* flag toggle column */}
              <div className="w-8 shrink-0">
                <button
                  onClick={() => onToggleFlag?.(q.id)}
                  aria-pressed={!!flags?.[q.id]}
                  className={
                    'p-1 rounded hover:bg-gray-100 cursor-pointer ' + (flags?.[q.id] ? 'text-yellow-500' : 'text-gray-400')
                  }
                  title={flags?.[q.id] ? 'Đã đánh dấu' : 'Đánh dấu'}
                >
                  <img
                  src={flags?.[q.id] ? "/assets/icons/marked_flag.svg" : "/assets/icons/unmarked_flag.svg"}
                  alt="flag"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* footer actions (kept hidden in original) */}
    </aside>
  );
}
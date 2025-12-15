'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Timer from './Timer';

export default function Controls({
  startAt,
  testData,
  onExpire,
  onExit,
}: {
  startAt: string | number;
  testData: { title: string; durationSeconds: number; testId: string };
  onExpire?: () => void;
  onExit?: () => void;
}) {
  const router = useRouter();

  function handleExit() {
    if (onExit) return onExit();
    // default behavior: navigate back to exam list
    //router.push('/exam');
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/assets/logos/temp_main_logo.png" alt="Logo" className="lg: w-16 lg:h-16 w-12 h-12 object-fill" />
      </div>

      <div className="flex items-center text-center">
        <Timer startAt={startAt} durationSeconds={testData.durationSeconds} testId={testData.testId} onExpire={onExpire} />
        <h3 className="px-2 text-xl font-semibold">{testData.title}</h3>
      </div>

      <div className="flex items-center gap-3">
        
        <button
          type="button"
          onClick={handleExit}
          className="ml-2 px-4 py-1 rounded-md shadow-md border border-slate-700 text-md bg-blue-100 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
        >
          Thoát
        </button>
      </div>
    </div>
  );
}
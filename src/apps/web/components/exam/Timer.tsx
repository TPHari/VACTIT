'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Timer({
  startAt,
  durationSeconds,
  onExpire,
  testId,
}: {
  startAt: string | number;
  durationSeconds: number;
  onExpire?: () => void;
  testId: string; 
}) {
  const startMs = typeof startAt === 'number' ? startAt : Date.parse(startAt);
  const storageKey = `exam_${testId}_endtime`;

  const [endTime, setEndTime] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(durationSeconds);
  const expiredRef = useRef(false);

useEffect(() => {
  const clearedKey = `exam_cleared_${testId}`;
  const cleared = sessionStorage.getItem(clearedKey);
  if (cleared) {
    sessionStorage.removeItem(clearedKey);
    setEndTime(0);
    return;
  }

  const savedEndTime = localStorage.getItem(storageKey);
  if (savedEndTime) {
    setEndTime(Number(savedEndTime));
  } else {
    const newEndTime = startMs + durationSeconds * 1000;
    localStorage.setItem(storageKey, String(newEndTime));
    setEndTime(newEndTime);
  }
}, [storageKey, startMs, durationSeconds, testId]);

  useEffect(() => {
    if (!endTime) return;

    function tick() {
      const now = Date.now();
      const next = Math.max(0, Math.floor((endTime - now) / 1000));
      setRemaining(next);

      if (next === 0 && !expiredRef.current) {
        expiredRef.current = true;
        localStorage.removeItem(storageKey); 
        onExpire?.();
      }
    }

    tick(); 
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime, onExpire, storageKey]);

  function formatTime(sec: number) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0)
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return (
    <div
      role="timer"
      aria-live="polite"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-base ${
        remaining <= 60 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'
      }`}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
      </svg>
      <span className="font-semibold">{formatTime(remaining)}</span>
    </div>
  );
}

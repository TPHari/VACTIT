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
    const savedEndTime = localStorage.getItem(storageKey);

    if (savedEndTime) {
      setEndTime(Number(savedEndTime));
    } else {
      const newEndTime = startMs + durationSeconds * 1000;
      localStorage.setItem(storageKey, String(newEndTime));
      setEndTime(newEndTime);
    }
  }, [storageKey, startMs, durationSeconds]);

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
      className={`px-3 py-1 rounded font-medium ${
        remaining <= 60 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {formatTime(remaining)}
    </div>
  );
}

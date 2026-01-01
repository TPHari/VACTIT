"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';

export default function OverviewTab() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingTestsCount, setPendingTestsCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.ok) setUser(data.user);
      });
  }, []);

  // Fetch tests and count how many the user hasn't attended
  useEffect(() => {
    const fetchPendingTests = async () => {
      try {
        const response = await api.tests.getAll({ limit: 100 });
        const tests = response.data || [];
        // Count tests where user has no trials (not attended)
        const pending = tests.filter((test: any) => {
          const trials = test.trials || [];
          return trials.length === 0;
        });
        setPendingTestsCount(pending.length);
      } catch (error) {
        console.error('Failed to fetch tests:', error);
      }
    };
    fetchPendingTests();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-row">
        <div className="flex flex-col flex-1 p-6 overflow-auto">
          <h1 className="page-title mb-6">Tổng quan</h1>
          <section className="card card--hero mb-6">
            <div className="card--hero__left">
              <p className="hero__subtitle">Chào mừng đã trở lại, {user?.name || '...'}!</p>
              <p className="hero__text">
                Tiếp tục làm bài thôi nào, bạn còn {pendingTestsCount} bài chưa làm trong tuần vừa rồi
              </p>
              <button
                className="btn btn--primary hero__button"
                onClick={() => router.push('/exam')}
              >
                Bắt đầu ngay
              </button>
            </div>
            <div className="card--hero__right">
              <img
                src="/assets/logos/hero-illustration.png"
                alt="Hero"
                className="hero-illustration"
                width={260}
              />
            </div>
          </section>

          <section className="grid grid--two-cols mb-6">
            <article className="card card--exam-now">
              <div className="card__title">Vào thi ngay</div>
              <div className="card--exam-now__body">
                <div className="card--exam-now__text">
                  <p>Hiện tại có 36 bạn đang làm bài thi ĐGNL</p>
                </div>
                <div className="card--exam-now__illustration">
                  <img
                    src="/assets/logos/vaothingay.png"
                    alt="Exam Now"
                    width={180}
                  />
                </div>
              </div>
            </article>

            <article className="card card--daily-quiz">
              <header className="card--daily-quiz__header">
                <h2>Daily Quiz</h2>
              </header>
              <div className="card--daily-quiz__question">
                <p>
                  Dòng nào sau đây nêu tên những tác phẩm cùng phong cách sáng tác
                  của trường phái văn học hiện thực?
                </p>
              </div>
              <div className="card--daily-quiz__options">
                <button className="quiz-option">
                  Tắt đèn, Số đỏ, Chí Phèo.
                </button>
                <button className="quiz-option quiz-option--selected">
                  Chữ người tử tù, Giông tố, Lão Hạc.
                </button>
              </div>
            </article>
          </section>
          <div />
          <div />
          {/* Bạn có thể move phần Leaderboard/Stats vào đây hoặc tách ra component riêng nữa nếu muốn */}
          <div />
        </div>
      </div>
    </DashboardLayout>
  );
}
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import ExamCard, { ExamData } from './ExamCard'; // Import Interface chuẩn từ Card
import ExamModal from './ExamModal';
import ExamFilterBar from '../functionalBar/ExamFilterBar';
import Loading from '../ui/LoadingSpinner';

export default function ExamList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query')?.toLowerCase() || '';

  // Sử dụng đúng Interface ExamData
  const [allExams, setAllExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentTab, setCurrentTab] = useState('all'); 
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [sortOrder, setSortOrder] = useState('newest');

  // --- 1. GỌI API & MAPPING DỮ LIỆU ---
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await api.tests.getAll({
          query: searchQuery,
          type: 'all', 
        });

        const rawData = response.data || [];

        // [MAPPING CHUẨN MỰC]
        const formattedData: ExamData[] = rawData.map((item: any) => {
          
          // 1. Xác định status: Có trial của user này không?
          const isTaken = item.trials && item.trials.length > 0;
          const status = isTaken ? 'completed' : 'not_started';

          return {
            id: item.test_id,
            title: item.title,
            author: item.author?.name || 'Unknown',
            
            // 2. Số câu hỏi (Nếu DB chưa có relation questions, fallback về 0)
            questions: item._count?.questions || 0, 
            
            // 3. Tổng lượt thi (Độ phổ biến)
            totalTrials: item._count?.trials || 0,
            
            duration: item.duration ? Math.floor(item.duration / 60) : 0, // Convert giây -> phút
            date: item.start_time || new Date().toISOString(),
            status: status,
            type: item.type || 'practice',
            subject: 'Tổng hợp',
            isVip: false, // Mặc định hoặc lấy từ DB
          };
        });

        setAllExams(formattedData);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [searchQuery]); 

  // --- 2. LOGIC FILTER ---
  const displayedExams = useMemo(() => {
    return allExams
      .filter((exam) => {
        if (currentTab === 'completed') return exam.status === 'completed';
        if (currentTab === 'not_started') return exam.status !== 'completed';
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (sortOrder === 'newest') return dateB - dateA;
        if (sortOrder === 'oldest') return dateA - dateB;
        return 0;
      });
  }, [allExams, currentTab, sortOrder]);

  return (
    <>
      {loading && <Loading />}

      <ExamFilterBar 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        sort={sortOrder}
        onSortChange={setSortOrder}
      />

      <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar p-2">
        {!loading && displayedExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {displayedExams.map((exam) => (
              <div 
                key={exam.id} 
                className="h-full transform transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:z-10"
              >
                <ExamCard 
                  exam={exam} 
                  onSelect={() => setSelectedExam(exam)} 
                />
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <p>Không tìm thấy đề thi nào phù hợp.</p>
          </div>
        )}
      </div>

      {selectedExam && (
        <ExamModal 
          exam={selectedExam} 
          onClose={() => setSelectedExam(null)} 
        />
      )}
    </>
  );
}
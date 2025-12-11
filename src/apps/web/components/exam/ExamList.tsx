'use client';

import React, { useState } from 'react';
import ExamCard from './ExamCard';
import ExamModal from './ExamModal';
import { MOCK_EXAMS } from '../../mockData/mockExam'; // Chú ý đường dẫn import mock data của bạn

//Đây là component "Cha" quản lý ExamCard và ExamModal

export default function ExamList() {
  const [examSubTab, setExamSubTab] = useState('chua-lam');
  const [selectedExam, setSelectedExam] = useState<any | null>(null);

  // Logic filter có thể phát triển thêm ở đây
  const filteredExams = MOCK_EXAMS; 

  return (
    <>
      {/* 2. Filter Bar */}
      <div className="bg-white p-3 rounded-xl shadow-sm mb-4 flex flex-wrap items-center justify-between gap-4 flex-shrink-0 border border-gray-100">
        <div className="flex gap-2 bg-blue-50 p-1 rounded-lg">
          {['chua-lam', 'da-lam', 'tong-hop'].map((tab) => (
            <button
              key={tab}
              onClick={() => setExamSubTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                examSubTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:bg-white/50'
              }`}
            >
              {tab === 'chua-lam' ? 'Chưa làm' : tab === 'da-lam' ? 'Đã làm' : 'Tổng hợp'}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          {['Mới nhất', 'Môn học', 'Độ khó'].map((label) => (
            <button
              key={label}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center gap-2 bg-white hover:border-blue-400 transition-colors"
            >
              {label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Scrollable Grid Area */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredExams.map((exam) => (
            <ExamCard 
                key={exam.id} 
                exam={exam} 
                onSelect={(e) => setSelectedExam(e)} 
            />
          ))}
        </div>
      </div>

      {/* 4. Modal */}
      {selectedExam && (
        <ExamModal 
            exam={selectedExam} 
            onClose={() => setSelectedExam(null)} 
        />
      )}
    </>
  );
}
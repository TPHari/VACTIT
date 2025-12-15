'use client';

import React from 'react';
import FilterDropdown from '../exam/FilterDropdown';

interface ExamFilterBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  
  subject: string;
  onSubjectChange: (val: string) => void;
  subjectsList: string[]; // Danh sách môn học lấy từ data

  difficulty: string;
  onDifficultyChange: (val: string) => void;

  sort: string;
  onSortChange: (val: string) => void;
}

export default function ExamFilterBar({
  currentTab,
  onTabChange,
  subject,
  onSubjectChange,
  subjectsList,
  difficulty,
  onDifficultyChange,
  sort,
  onSortChange
}: ExamFilterBarProps) {
  
  return (
    <div className="bg-white p-3 rounded-xl shadow-sm mb-4 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 flex-shrink-0 border border-gray-100">
      {/* 1. Tabs (Chưa làm / Đã làm) */}
      <div className="flex gap-2 bg-blue-50 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
        {['chua-lam', 'da-lam', 'tong-hop'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
              currentTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:bg-white/50'
            }`}
          >
            {tab === 'chua-lam' ? 'Chưa làm' : tab === 'da-lam' ? 'Đã làm' : 'Tổng hợp'}
          </button>
        ))}
      </div>

      {/* 2. Dropdown Filters */}
      <div className="flex gap-3 w-full sm:w-auto justify-end">
        {/* Filter: Sắp xếp */}
        <FilterDropdown
          label="Mới nhất"
          value={sort}
          onChange={onSortChange}
          options={[
            { value: 'newest', label: 'Mới nhất' },
            { value: 'oldest', label: 'Cũ nhất' },
          ]}
        />

        {/* Filter: Môn học */}
        <FilterDropdown
          label="Môn học"
          value={subject}
          onChange={onSubjectChange}
          options={subjectsList.map(s => ({ value: s, label: s }))}
        />

        {/* Filter: Độ khó */}
        <FilterDropdown
          label="Độ khó"
          value={difficulty}
          onChange={onDifficultyChange}
          options={[
            { value: 'Easy', label: 'Dễ' },
            { value: 'Medium', label: 'Trung bình' },
            { value: 'Hard', label: 'Khó' },
          ]}
        />
      </div>
    </div>
  );
}
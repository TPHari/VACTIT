'use client';

import React from 'react';
import FilterDropdown from '../exam/FilterDropdown';

interface ExamFilterBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;

  sort: string;
  onSortChange: (val: string) => void;
}

export default function ExamFilterBar({
  currentTab,
  onTabChange,
  sort,
  onSortChange
}: ExamFilterBarProps) {
  
  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'completed', label: 'Đã làm' },
    { id: 'not_started', label: 'Chưa làm' },
  ];

  return (
    <div className="bg-white p-3 rounded-xl shadow-sm mb-4 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 flex-shrink-0 border border-gray-100">
      {/* 1. Tabs (Tất cả / Đã làm / Chưa làm) */}
      <div className="flex gap-2 bg-blue-50 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
              currentTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Dropdown Filters */}
      <div className="flex gap-3 w-full sm:w-auto justify-end">
        {/* Filter: Sắp xếp */}
        <FilterDropdown
          label="Sắp xếp"
          value={sort}
          onChange={onSortChange}
          options={[
            { value: 'newest', label: 'Mới nhất' },
            { value: 'oldest', label: 'Cũ nhất' },
          ]}
        />
        
      </div>
    </div>
  );
}
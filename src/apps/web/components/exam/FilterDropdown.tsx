'use client';

import React, { useState, useRef, useEffect } from 'react';

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export default function FilterDropdown({ label, options, value, onChange, icon }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 border rounded-lg text-sm flex items-center gap-2 transition-colors ${
          value 
            ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
        }`}
      >
        {/* Hiển thị label đã chọn hoặc label mặc định */}
        {value ? selectedLabel : label}
        
        {icon || (
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1">
          {/* Option mặc định để bỏ lọc */}
          <button
            onClick={() => { onChange(''); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 border-b border-gray-50"
          >
            -- Tất cả --
          </button>
          
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                value === opt.value ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
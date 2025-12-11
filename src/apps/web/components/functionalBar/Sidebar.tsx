'use client'; 

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const MENU_ITEMS = [
  { id: 'overview', label: 'Tổng quan', path: '/' },
  { id: 'exam', label: 'Vào thi', path: '/exam' },
  { id: 'result', label: 'Kết quả', path: '/result' },
  { id: 'leaderboard', label: 'Bảng xếp hạng', path: '/leaderboard' },
  { id: 'teachers', label: 'Giáo viên', path: '/teachers' },
  { id: 'guide', label: 'Hướng dẫn thi', path: '/guide' },
  { id: 'faq', label: 'Câu hỏi thường gặp', path: '/faq' },
  { id: 'news', label: 'Tin tức mới nhất', path: '/news' },
  { id: 'settings', label: 'Cài đặt', path: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    // THAY ĐỔI: 
    // 1. top-4 left-4 bottom-4: Cách đều các cạnh 16px (1rem)
    // 2. rounded-3xl: Bo góc mạnh
    // 3. shadow-xl: Đổ bóng sâu để tạo cảm giác nổi
    // 4. h-[calc(100vh-2rem)]: Chiều cao tự tính toán để không bị tràn
    <aside className="fixed top-4 left-4 h-[calc(100vh-2rem)] w-64 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col z-50 overflow-hidden transition-all duration-300">
      
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center border-b border-gray-50 bg-gray-50/50">
        <Image
          src="/assets/logos/logo.png"
          alt="BAI-LEARN logo"
          width={36} 
          height={36}
          className="object-contain"
        />
        <span className="ml-3 font-extrabold text-xl text-blue-600 tracking-tight">BAI-LEARN</span>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar"> 
        {MENU_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              href={item.path}
              // Bo góc cho từng item để đồng bộ
              className={`flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Support Card (Compact) */}
      <div className="p-4 bg-gray-50/50">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
                {/* Icon support */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                </svg>
             </div>
            <p className="text-xs font-medium text-gray-500 mb-3">Bạn gặp khó khăn?</p>
            <button className="text-xs bg-gray-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-600 transition-colors w-full">
                Nhắn tin
            </button>
        </div>
      </div>
    </aside>
  );
}
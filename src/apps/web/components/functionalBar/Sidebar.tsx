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
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
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
      <div className="sidebar__support-card">
        <div className="sidebar__support-illustration">
          <img
            src="/assets/logos/support.png"
            alt="Support"
            width={80}
            height={80}
          />
        </div>
        <div className="sidebar__support-text">
          <h3>Liên hệ hỗ trợ</h3>
          <p>Chúng mình sẽ hỗ trợ nhanh nhất có thể</p>
        </div>
        <button className="btn btn--secondary">Nhắn tin</button>
      </div>
    </aside>
  );
}
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
    <aside className="sidebar fixed top-4 left-4 h-[calc(100vh-2rem)] rounded-3xl z-50 overflow-hidden overflow-x-hidden transition-all duration-300">
      
      {/* Logo Section */}
      <div className="sidebar__logo h-20 mb-4 border-b border-black/5">
        <Image
          src="/assets/logos/logo.png"
          alt="BAI-LEARN logo"
          width={36} 
          height={36}
          className="object-contain"
        />
        <span className="sidebar__logo-text ml-3">BAI·LEARN</span>
      </div>

      {/* Nav Section */}
      <nav className="sidebar__nav flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar"> 
        {MENU_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`sidebar__nav-item flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group gap-3 ${
                active ? 'sidebar__nav-item--active' : ''
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Support Card */}
      <div className="sidebar__support-card mt-auto">
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
        
        <a 
          href="https://www.facebook.com/bailearn" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn--secondary mt-2 w-full text-center flex items-center justify-center no-underline"
        >
          Nhắn tin
        </a>
      </div>
    </aside>
  );
}
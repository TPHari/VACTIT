'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

interface NotificationData {
  notification_id: string;
  title: string;
  message: string;
  type: string;
  link: string;
  created_at: string;
  user_id: string | null;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hàm gọi API lấy thông báo
  const fetchNotifications = async () => {
    try {
      const json = await api.notifications.getAll();
      
      if (json.data) {
        const data = json.data as NotificationData[];
        setNotifications(data);
        
        // --- LOGIC CHECK ĐÃ ĐỌC (LOCAL STORAGE) ---
        const lastReadTime = localStorage.getItem('last_read_noti_time');
        
        if (lastReadTime) {
           // Chỉ đếm những thông báo mới hơn thời điểm xem lần cuối
           const count = data.filter((n) => new Date(n.created_at).getTime() > new Date(lastReadTime).getTime()).length;
           setUnreadCount(count);
        } else {
           // Nếu chưa từng xem bao giờ -> Tất cả đều là mới
           setUnreadCount(data.length);
        }
        // ------------------------------------------
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Polling: Cập nhật mỗi 30s
    const intervalId = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(intervalId);
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      // KHI MỞ RA XEM:
      // 1. Xóa số lượng chưa đọc (Mất chấm đỏ)
      setUnreadCount(0);
      // 2. Lưu thời điểm hiện tại vào Local Storage
      // (Lần sau reload trang, code sẽ so sánh với mốc thời gian này)
      localStorage.setItem('last_read_noti_time', new Date().toISOString());
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút Chuông */}
      <button onClick={handleToggle} className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Danh sách */}
      {isOpen && (
        <div className="absolute right-0 top-[120%] z-50 w-80 sm:w-96 rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Thông báo mới nhất</h3>
            {/* Nút đánh dấu đã đọc thủ công (Optional) */}
            <button 
              onClick={() => {
                setUnreadCount(0);
                localStorage.setItem('last_read_noti_time', new Date().toISOString());
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Đánh dấu đã đọc
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-sm">Chưa có thông báo nào</div>
            ) : (
              notifications.map((noti) => {
                // Kiểm tra xem thông báo này có phải là "Mới" không để highlight (Optional)
                const lastRead = localStorage.getItem('last_read_noti_time');
                const isNew = !lastRead || new Date(noti.created_at).getTime() > new Date(lastRead).getTime();

                return (
                  <Link 
                      key={noti.notification_id} 
                      href={noti.link || '#'} 
                      onClick={() => setIsOpen(false)} 
                      className={`block p-3 border-b border-slate-50 transition-colors ${isNew ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'}`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1 text-xl">
                          {noti.type === 'exam' ? '📝' : noti.type === 'news' ? '📰' : '🔔'}
                      </div>
                      <div>
                        <p className={`text-sm text-slate-800 ${isNew ? 'font-bold' : 'font-semibold'}`}>
                          {noti.title}
                          {isNew && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2">{noti.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(noti.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} • {new Date(noti.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
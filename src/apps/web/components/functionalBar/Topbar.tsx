"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MOCK_USER as USER } from "@/lib/mock-user"; // Đảm bảo đường dẫn này đúng trong project của bạn

export default function Topbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Lấy giá trị search hiện tại từ URL để khi F5 không bị mất text trong ô input
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");

  // Đóng menu profile khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC TÌM KIẾM (REAL SEARCH) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      if (searchTerm) {
        params.set("query", searchTerm);
      } else {
        params.delete("query");
      }
      
      // Cập nhật URL mà không reload trang (scroll: false giữ vị trí cuộn)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300); // Đợi 300ms sau khi ngừng gõ mới tìm

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParams, pathname, router]);


  const handleLogout = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    router.push("/auth/login");
  };

  return (
    // fixed top-4 right-4 left-[18rem]: Cố định vị trí, tránh Sidebar (260px ~ 16.25rem, để 18rem cho thoáng)
    <header className="fixed top-4 right-4 left-[18rem] z-40 flex h-16 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md px-6 shadow-sm transition-all duration-300">
      
      {/* Left: Search Bar */}
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-md group">
          {/* Icon Kính lúp */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm đề thi, giáo viên..."
            className="block w-full p-2.5 pl-10 text-sm text-slate-800 border border-slate-200 rounded-full bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
          
          {/* Nút xóa (X) hiện khi có text */}
          {searchTerm && (
            <button 
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
            </button>
          )}
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="relative flex items-center gap-4" ref={menuRef}>
        
        {/* Bell Button */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-2 right-2.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* Profile Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
        >
          <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100">
            <Image
              src="/assets/logos/avatar.png"
              alt={USER.name}
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <div className="hidden flex-col text-left text-xs sm:flex">
            <span className="font-bold text-slate-700">{USER.name}</span>
            <span className="text-[10px] text-slate-400 font-medium">Học viên</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-[120%] z-50 w-60 rounded-2xl bg-white p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-3 text-xs bg-slate-50 rounded-xl mb-1">
              <p className="font-bold text-slate-800 text-sm">{USER.name}</p>
              <p className="text-slate-500 truncate">{USER.email}</p>
            </div>
            
            <button onClick={() => router.push('/profile')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Hồ sơ cá nhân
            </button>
            
            <div className="my-1 h-px bg-slate-100 mx-2" />
            
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
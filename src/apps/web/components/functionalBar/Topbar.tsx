"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MOCK_USER as USER } from "@/lib/mock-user";

export default function Topbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
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

  const handleMyProfile = () => {
    setIsOpen(false);
    router.push("/profile");
  };

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
    // ✨ ĐÃ SỬA: Thêm các class định vị để Topbar 'né' Sidebar và nổi lên trên
    <header className="fixed top-4 right-4 left-[18rem] z-40 flex h-16 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 shadow-sm transition-all duration-300">
      
      {/* Left: title or search */}
      <div className="flex flex-1 items-center gap-3">
        <div className="relative max-w-md flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm đề thi, báo cáo..."
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-brand-text shadow-sm outline-none placeholder:text-slate-400 focus:border-brand-primary"
          />
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="relative flex items-center gap-3" ref={menuRef}>
        {/* Bell */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm hover:bg-slate-50 border border-slate-100"
        >
          <Image
            src="/assets/logos/bell.png"
            alt="Thông báo"
            width={18}
            height={18}
          />
        </button>

        {/* Profile + dropdown trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full bg-white pl-1 pr-2 py-1 shadow-sm transition hover:bg-slate-50 border border-slate-100"
        >
          <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200">
            <Image
              src="/assets/logos/avatar.png"
              alt={USER.name}
              width={32}
              height={32}
            />
          </div>
          <div className="hidden flex-col text-left text-xs sm:flex">
            <span className="font-semibold text-brand-text leading-tight">{USER.name}</span>
            <span className="text-[10px] text-brand-muted leading-tight">
              ID: {USER.id}
            </span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-slate-400 transition ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute right-0 top-[120%] z-50 w-56 rounded-xl bg-white p-1 shadow-xl ring-1 ring-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-3 text-xs text-slate-500 bg-slate-50 rounded-t-lg mb-1">
              <p className="font-bold text-brand-text text-sm mb-0.5">{USER.name}</p>
              <p className="truncate text-[11px] font-medium">{USER.email}</p>
            </div>
            
            <button
              type="button"
              onClick={handleMyProfile}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-text hover:bg-slate-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>Trang cá nhân</span>
            </button>
            
            <div className="my-1 h-px bg-slate-100 mx-2" />
            
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
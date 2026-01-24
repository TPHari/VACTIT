"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import NotificationBell from "@/components/ui/NotificationBell";
import { useCurrentUser } from "@/lib/swr-hooks";

export default function Topbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");

  // ✅ Use shared SWR hook instead of direct fetch
  const { user } = useCurrentUser();

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

  // Hàm xử lý tìm kiếm khi bấm Enter ---
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim()) {
      params.set("query", searchTerm.trim());
    } else {
      params.delete("query");
    }

    // Dùng push thay vì replace để người dùng có thể back lại kết quả cũ
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLogout = async () => {
    setIsOpen(false);
    // Clear local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    // Sign out from NextAuth (invalidates session cookie)
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <header className="sticky top-0 right-0 left-0 z-50 flex h-[4rem] items-center justify-between gap-[1rem] border-b border-slate-200 bg-white/95 backdrop-blur-md px-[1.5rem] shadow-sm">
      {/* Left: Logo + Brand Name + Search Bar */}
      <div className="flex items-center gap-[1rem]">
        <Link href="/" className="flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-80 transition-opacity">
          <Image
            src="/assets/logos/topbar_logo.svg"
            alt="BAI-LEARN logo"
            width={48}
            height={48}
            className="object-contain w-[5rem] h-[5rem]"
          />
        </Link>

        {/* Search Bar */}
        {/* Search Bar */}
        <div className="relative w-full max-w-[32rem] group flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Tìm kiếm bài thi"
            className="block w-full py-[0.5rem] pl-[1rem] pr-[7.5rem] text-[0.875rem] text-slate-800 border border-slate-200 rounded-l-full bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
              }}
              className="absolute right-[4.25rem] flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[1rem] h-[1rem]">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
          <button
            onClick={handleSearch}
            className="flex items-center justify-center px-[1.25rem] py-[0.5rem] bg-blue-600 hover:bg-blue-700 rounded-r-full border border-blue-600 transition-colors"
          >
            <svg className="w-[1.25rem] h-[1.25rem] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Right: Notifications + Profile */}
      <div className="relative flex items-center gap-4" ref={menuRef}>
        <NotificationBell />
        <div className="h-[2rem] w-px bg-slate-200 hidden sm:block"></div>

        {/* Profile Button */}
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center gap-[0.75rem] rounded-full py-[0.25rem] pl-[0.25rem] pr-[0.75rem] hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
        >
          <div className="h-[2.25rem] w-[2.25rem] overflow-hidden rounded-full border-[0.125rem] border-white shadow-sm ring-1 ring-slate-100">
            <Image
              src={user?.avatarUrl || "/assets/logos/avatar.png"}
              alt={user?.name || "User"}
              width={36}
              height={36}
              className="object-cover w-[2rem] h-[2rem]"
            />
          </div>
          <div className="hidden flex-col text-left text-[0.75rem] sm:flex">
            <span className="font-bold text-slate-700">{user?.name || "..."}</span>
            <span className="text-[0.625rem] text-slate-400 font-medium">Học viên</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-[1rem] w-[1rem] text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Dropdown Profile (Giữ nguyên) */}
        {isOpen && user && (
          <div className="absolute right-0 top-[120%] z-50 w-60 rounded-2xl bg-white p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-3 text-xs bg-slate-50 rounded-xl mb-1">
              <p className="font-bold text-slate-800 text-sm">{user.name}</p>
              <p className="text-slate-500 truncate">{user.email}</p>
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
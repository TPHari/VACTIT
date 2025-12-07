"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const USER = {
  name: "Quang Thanh",
  id: "012345",
  email: "quang.thanh@example.com",
};

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

    // 🔐 Adjust keys to match your auth implementation
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between gap-4">
      {/* Left: title or search */}
      <div className="flex flex-1 items-center gap-3">
        {/* Example search bar, change to your actual content */}
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
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
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
          className="flex items-center gap-2 rounded-full bg-white px-2 py-1 shadow-sm transition hover:bg-slate-50"
        >
          <div className="h-9 w-9 overflow-hidden rounded-full">
            <Image
              src="/assets/logos/avatar.png"
              alt={USER.name}
              width={36}
              height={36}
            />
          </div>
          <div className="hidden flex-col text-left text-xs sm:flex">
            <span className="font-semibold text-brand-text">{USER.name}</span>
            <span className="text-[11px] text-brand-muted">
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
          <div className="absolute right-0 top-[110%] z-20 w-48 rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-100">
            <div className="px-3 py-2 text-xs text-slate-500">
              <p className="font-semibold text-brand-text">{USER.name}</p>
              <p className="truncate text-[11px]">{USER.email}</p>
            </div>
            <div className="my-1 h-px bg-slate-100" />
            <button
              type="button"
              onClick={handleMyProfile}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-text hover:bg-slate-50"
            >
              <span>My Profile</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

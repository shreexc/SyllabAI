"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { UserRole } from "@/types/learning";

interface TopbarProps {
  role: UserRole;
  onOpenMobileMenu?: () => void;
}

export function Topbar({ role, onOpenMobileMenu }: TopbarProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/${role}/history?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const userName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.email
    : "Student";
  const initials = user
    ? `${user.first_name[0] || ""}${user.last_name[0] || ""}`.toUpperCase() ||
      user.email[0]?.toUpperCase() ||
      "S"
    : "S";

  return (
    <header className="flex h-[76px] items-center justify-between rounded-[15px] bg-white px-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)] font-ui">
      {/* Mobile Hamburger Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
          aria-label="Open navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex w-full max-w-[460px] items-center" role="search">
          <span className="pointer-events-none absolute left-4 text-[#7665F5]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learning materials..."
            className="h-[42px] w-[320px] sm:w-[420px] rounded-[15px] border border-[#B3B3B3] bg-white pl-11 pr-4 text-[14.5px] text-[#000000] placeholder-[#8E8A98] outline-none transition-colors focus:border-[#7665F5]"
            aria-label="Search learning materials"
          />
        </form>
      </div>

      {/* Right User Capsule */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-[13.5px] font-semibold text-[#7665F5]"
          style={{ backgroundColor: "#DBD3FB" }}
        >
          {initials}
        </div>
        <span className="hidden sm:inline-block text-[15px] font-medium text-[#7665F5]">
          {userName}
        </span>
      </div>
    </header>
  );
}

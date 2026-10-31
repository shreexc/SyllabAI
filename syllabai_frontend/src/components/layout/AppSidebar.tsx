"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import type { UserRole } from "@/types/learning";

interface AppSidebarProps {
  role: UserRole;
  onSignOut: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ role, onSignOut, isOpen = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  const links = [
    {
      name: "Overview",
      href: `/${role}/dashboard`,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        </svg>
      ),
    },
    {
      name: "Quizzes",
      href: `/${role}/quizzes`,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
      ),
    },
    {
      name: "Animation",
      href: `/${role}/animations`,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="7 4 19 12 7 20 7 4" />
        </svg>
      ),
    },
    {
      name: "Flashcards",
      href: `/${role}/flashcards`,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 19L9 5h10l-4 14H5z" />
        </svg>
      ),
    },
    {
      name: "Classroom",
      href: `/${role}/classes`,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="13" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
          <path d="M7 10h3" />
          <path d="M13 10h4" />
        </svg>
      ),
    },
    {
      name: "Chat with AI",
      href: `/${role}/chat`,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="6" width="16" height="13" rx="3" />
          <path d="M12 2v4" />
          <circle cx="9" cy="12" r="1.5" fill="currentColor" />
          <circle cx="15" cy="12" r="1.5" fill="currentColor" />
          <path d="M9 16h6" />
          <path d="M2 11h2" />
          <path d="M20 11h2" />
        </svg>
      ),
    },
    {
      name: "History",
      href: `/${role}/history`,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 14" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`flex w-[290px] flex-shrink-0 flex-col rounded-[15px] bg-white p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-transform ${
          isOpen ? "fixed inset-y-4 left-4 z-50" : "hidden md:flex"
        }`}
        style={{ minHeight: "calc(100vh - 48px)" }}
        aria-label={`${role === "teacher" ? "Teacher" : "Student"} navigation`}
      >
        {/* Brand Logo & Name */}
        <Link
          href={`/${role}/dashboard`}
          onClick={onClose}
          className="flex items-center gap-3.5 transition-opacity hover:opacity-90"
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] text-white shadow-sm"
            style={{
              background: "linear-gradient(135deg, #30285B 0%, #6555C1 100%)",
            }}
          >
            <span className="font-dm-serif text-[26px] leading-none text-white select-none">
              S
            </span>
          </div>
          <span className="font-ui text-[24px] font-semibold tracking-[-0.01em] text-[#000000]">
            SyllabAI
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="mt-9 flex flex-col gap-1.5" aria-label="Main menu">
          {links.map((link) => {
            const isActive =
              link.href === `/${role}/dashboard`
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={`flex h-11 items-center gap-3.5 rounded-[10px] px-3.5 text-[16px] font-medium transition-colors ${
                  isActive
                    ? "text-[#1E1B2E] font-semibold"
                    : "text-[#5A5565] hover:bg-[#F8F6FF] hover:text-[#7665F5]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={isActive ? "text-[#1E1B2E]" : "text-[#6B7280]"}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile & Sign out */}
        <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-[#F0ECFE]">
          <Link
            href={`/${role}/profile`}
            onClick={onClose}
            className="flex items-center gap-3.5 rounded-[10px] px-2 py-1.5 text-[16px] font-medium text-[#5A5565] transition-colors hover:text-[#7665F5]"
          >
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "#DBD3FB" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7665F5"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span>My Profile</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              const confirmed = window.confirm("Are you sure you want to sign out?");
              if (confirmed) {
                if (onClose) onClose();
                onSignOut();
              }
            }}
            className="flex items-center gap-3.5 rounded-[10px] px-2 py-1.5 text-left text-[16px] font-medium text-[#5A5565] transition-colors hover:text-[#7665F5]"
          >
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "#DBD3FB" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7665F5"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

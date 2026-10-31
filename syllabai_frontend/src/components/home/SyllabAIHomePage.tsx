"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function SyllabAIHomePage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");

  const userName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : "Namrata Lamichhane";
  const firstName = user?.first_name || "Namrata";
  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : "NL";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/student/history?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navItems = [
    {
      name: "Overview",
      href: "/student/dashboard",
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
          aria-hidden="true"
        >
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        </svg>
      ),
    },
    {
      name: "Quizzes",
      href: "/student/quizzes",
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
          aria-hidden="true"
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
      href: "/student/animations",
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
          aria-hidden="true"
        >
          <polygon points="7 4 19 12 7 20 7 4" />
        </svg>
      ),
    },
    {
      name: "Flashcards",
      href: "/student/flashcards",
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
          aria-hidden="true"
        >
          <path d="M5 19L9 5h10l-4 14H5z" />
        </svg>
      ),
    },
    {
      name: "Classroom",
      href: "/student/classes",
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
          aria-hidden="true"
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
      href: "/student/chat",
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
          aria-hidden="true"
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
      href: "/student/history",
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
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 14" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen w-full font-ui"
      style={{
        backgroundColor: "#F8F6FF",
        color: "#000000",
      }}
    >
      {/* 1440px Canvas Container */}
      <div className="home-layout mx-auto flex max-w-[1440px] gap-6 p-6 min-h-screen">
        {/* Left Sidebar */}
        <aside
          className="home-sidebar flex w-[290px] flex-shrink-0 flex-col rounded-[15px] bg-white p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          aria-label="Navigation Sidebar"
        >
          {/* Brand Logo & Name */}
          <Link href="/" className="home-brand flex items-center gap-3.5 transition-opacity hover:opacity-90">
            <div
              className="home-brand-mark flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] text-white shadow-sm"
              style={{
                background: "linear-gradient(135deg, #806CF4 0%, #6555C1 100%)",
              }}
            >
              <span className="font-dm-serif text-[26px] leading-none text-black select-none">
                S
              </span>
            </div>
            <span className="home-brand-name font-ui text-[24px] font-semibold tracking-[-0.01em] text-[#000000]">
              SyllabAI
            </span>
          </Link>

          {/* Navigation Items */}
          <nav className="home-nav mt-9 flex flex-col gap-1.5" aria-label="Main Menu">
            {navItems.map((item) => {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="home-nav-link flex h-11 items-center gap-3.5 rounded-[10px] px-3.5 text-[16px] font-medium transition-colors"
                >
                  <span className="home-nav-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Profile & Sign Out Links */}
          <div className="home-sidebar-actions mt-auto flex flex-col gap-3 pt-6 border-t border-[#F0ECFE]">
            <Link
              href="/student/profile"
              className="home-sidebar-action flex items-center gap-3.5 rounded-[10px] px-2 py-1.5 text-[16px] font-medium text-[#5A5565] transition-colors hover:text-[#7665F5]"
            >
              <div
                className="home-sidebar-action-icon flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "#D7D1FA" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#756A6A"
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
                  router.push("/login");
                }
              }}
              className="home-sidebar-action flex items-center gap-3.5 rounded-[10px] px-2 py-1.5 text-left text-[16px] font-medium text-[#5A5565] transition-colors hover:text-[#7665F5]"
            >
              <div
                className="home-sidebar-action-icon flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "#D7D1FA" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#756A6A"
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

        {/* Right Main Area */}
        <main className="home-main flex flex-1 flex-col gap-6">
          {/* Top Header Bar */}
          <header className="home-topbar flex h-[76px] items-center justify-between rounded-[15px] bg-white px-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="home-search relative flex w-full max-w-[460px] items-center">
              <span className="home-search-icon pointer-events-none absolute left-4 text-[#7665F5]">
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
                className="home-search-input h-[42px] w-full rounded-[15px] border border-[#B3B3B3] bg-white pl-11 pr-4 text-[14.5px] text-[#000000] placeholder-[#8E8A98] outline-none transition-colors focus:border-[#7665F5]"
              />
            </form>

            {/* Profile Capsule */}
            <div className="home-profile flex items-center gap-3">
              <div
                className="home-avatar flex h-9 w-9 items-center justify-center rounded-full text-[13.5px] font-semibold text-[#7665F5]"
                style={{ backgroundColor: "#D7D1FA" }}
              >
                {initials}
              </div>
              <span className="home-user-name text-[15px] font-medium text-[#7665F5]">
                {userName}
              </span>
            </div>
          </header>

          {/* Hero Banner: YOUR STUDY SPACE */}
          <section
            className="home-welcome flex items-center justify-between rounded-[16px] bg-white px-9 py-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            aria-label="Welcome study banner"
          >
            <div className="home-welcome-copy max-w-[580px]">
              <span
                className="home-eyebrow block text-[13px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: "#7665F5" }}
              >
                YOUR STUDY SPACE
              </span>
              <h1 className="home-welcome-title mt-1.5 font-baskervville text-[38px] font-normal leading-[1.15] text-[#000000]">
                Welcome back,<br />
                <span style={{ color: "#7665F5" }}>{firstName}.</span>
              </h1>
              <p className="home-welcome-description mt-2 text-[15px] text-[#756A6A] leading-relaxed">
                Study at your own pace with quizzes, flashcards, short notes and animations.
              </p>
            </div>

            {/* 3D Stack of books & pencil art */}
            <div className="home-welcome-art">
              <Image
                src="/images/study-banner-art-user.png"
                alt="Study space 3D books illustration"
                width={220}
                height={155}
                priority
                className="object-contain"
              />
            </div>
          </section>

          {/* YOUR STUDY STATS Section */}
          <section className="home-stats flex flex-col gap-4" aria-label="Study statistics">
            <div className="home-stats-heading flex items-end justify-between">
              <div>
                <span className="home-eyebrow block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#756A6A]">
                  YOUR STUDY STATS
                </span>
                <h2 className="home-section-title mt-0.5 font-baskervville text-[38px] font-bold leading-tight text-[#000000]">
                  Learning Overview
                </h2>
              </div>

              {/* Learning Streak Badge */}
              <div className="home-streak flex items-center gap-1.5 rounded-full bg-white px-5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E5E0F5]/60">
                <span className="text-[14px] font-medium text-[#4B465D]">
                  Learning Streak : 5
                </span>
                <span className="text-[16px]" role="img" aria-label="streak flame">
                  🔥
                </span>
              </div>
            </div>

            {/* 3 Stat Cards Grid */}
            <div className="home-stat-grid grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Card 1: ANIMATION */}
              <div
                className="home-stat-card flex flex-col rounded-[15px] p-6 border transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(188, 255, 173, 0.35)",
                }}
              >
                <div className="home-stat-label flex items-center gap-3">
                  {/* Play circle icon */}
                  <svg
                    className="home-stat-icon"
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="1.6"
                  >
                    <circle cx="16" cy="16" r="13" />
                    <polygon points="13 11 22 16 13 21 13 11" fill="none" />
                  </svg>
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[#374151]">
                    ANIMATION
                  </span>
                </div>
                <div className="home-stat-count my-3 font-dm-serif text-[56px] font-normal leading-none text-[#000000]">
                  4
                </div>
                <div className="home-stat-description text-[13px] text-[#4B465D]">
                  Generated animations
                </div>
              </div>

              {/* Card 2: QUIZZES */}
              <div
                className="home-stat-card flex flex-col rounded-[15px] p-6 border transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255, 164, 226, 0.29)",
                }}
              >
                <div className="home-stat-label flex items-center gap-3">
                  {/* Document with checklist icon */}
                  <svg
                    className="home-stat-icon"
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="7" y="5" width="18" height="22" rx="3" />
                    <path d="M11 11h2" />
                    <path d="M15 11h6" />
                    <path d="M11 16h2" />
                    <path d="M15 16h6" />
                    <path d="M11 21h2" />
                    <path d="M15 21h6" />
                  </svg>
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[#374151]">
                    QUIZZES
                  </span>
                </div>
                <div className="home-stat-count my-3 font-dm-serif text-[56px] font-normal leading-none text-[#000000]">
                  2
                </div>
                <div className="home-stat-description text-[13px] text-[#4B465D]">
                  Interactive practice quizzes
                </div>
              </div>

              {/* Card 3: FLASHCARDS */}
              <div
                className="home-stat-card flex flex-col rounded-[15px] p-6 border transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(208, 237, 250, 0.48)",
                }}
              >
                <div className="home-stat-label flex items-center gap-3">
                  {/* Parallelogram card deck icon */}
                  <svg
                    className="home-stat-icon"
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 24L12 8h13l-5 16H7z" />
                  </svg>
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[#374151]">
                    FLASHCARDS
                  </span>
                </div>
                <div className="home-stat-count my-3 font-dm-serif text-[56px] font-normal leading-none text-[#000000]">
                  1
                </div>
                <div className="home-stat-description text-[13px] text-[#4B465D]">
                  Active recall study decks
                </div>
              </div>
            </div>
          </section>

          {/* RECENT SESSION Section */}
          <section className="home-recent flex flex-col gap-4" aria-label="Recent session">
            <div className="home-recent-heading">
              <span className="home-eyebrow block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#756A6A]">
                RECENT SESSION
              </span>
              <h2 className="home-section-title mt-0.5 font-baskervville text-[38px] font-bold leading-tight text-[#000000]">
                Resume Studying
              </h2>
            </div>

            {/* Newton's Second Law Card */}
            <div className="home-resume-card flex flex-col rounded-[16px] bg-white p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              {/* Card Top Row */}
              <div className="home-resume-meta flex items-center justify-between">
                <span className="rounded-full bg-[#E8F8E5] px-3.5 py-1 text-[13px] font-medium text-[#2E7D32]">
                  Animation
                </span>
                <span className="text-[13px] text-[#756A6A]">
                  2 mins remaining
                </span>
              </div>

              {/* Subject Title */}
              <h3 className="home-resume-title mt-3.5 font-baskervville text-[17px] font-semibold text-[#000000]">
                Newton’s Second Law of Motion
              </h3>

              {/* Progress Bar */}
              <div className="home-resume-progress mt-2.5 h-[3.5px] w-full max-w-[620px] rounded-full bg-[#D1D5DB] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "50%",
                    backgroundColor: "#7665F5",
                  }}
                />
              </div>

              {/* Continue Watching Button */}
              <div className="home-resume-action mt-5 flex justify-end">
                <Link
                  href="/student/animations"
                  className="home-resume-button inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-[13.5px] font-medium text-[#4B465D] transition-colors hover:bg-[#E5E5E5]"
                  style={{ backgroundColor: "#EFEFEF" }}
                >
                  <span>Continue Watching</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

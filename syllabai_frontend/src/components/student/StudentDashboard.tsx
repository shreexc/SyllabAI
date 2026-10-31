"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getDashboard } from "@/lib/learning-api";
import type { DashboardSummary } from "@/types/learning";

export function StudentDashboard() {
  const { user } = useCurrentUser();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const fetchDashboardData = async () => {
    try {
      const data = await getDashboard("student");
      setSummary(data.summary || {});
    } catch {
      // Graceful fallback to default stats if backend is offline
    }
  };

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  const firstName = user?.first_name || "Namrata";
  const animationsCount = 4;
  const quizzesCount = summary?.quizzes_count ?? 2;
  const flashcardsCount = summary?.flashcards_count ?? 1;

  return (
    <div className="flex flex-col gap-6 font-ui">
      {/* Hero Banner: YOUR STUDY SPACE */}
      <section
        className="flex items-center justify-between rounded-[16px] bg-white px-9 py-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        aria-label="Welcome study banner"
      >
        <div className="max-w-[580px]">
          <span
            className="block text-[13px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: "#7665F5" }}
          >
            YOUR STUDY SPACE
          </span>
          <h1 className="mt-1.5 font-baskervville text-[38px] font-normal leading-[1.15] text-[#000000]">
            Welcome back,<br />
            <span style={{ color: "#7665F5" }}>{firstName}.</span>
          </h1>
          <p className="mt-2 text-[15px] text-[#756A6A] leading-relaxed">
            Study at your own pace with quizzes, flashcards, short notes and animations.
          </p>
        </div>

        {/* 3D Stack of books & pencil art */}
        <div className="relative flex items-center justify-center flex-shrink-0">
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
      <section className="flex flex-col gap-4" aria-label="Study statistics">
        <div className="flex items-end justify-between">
          <div>
            <span className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#756A6A]">
              YOUR STUDY STATS
            </span>
            <h2 className="mt-0.5 font-baskervville text-[38px] font-bold leading-tight text-[#000000]">
              Learning Overview
            </h2>
          </div>

          {/* Learning Streak Badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E5E0F5]/60">
            <span className="text-[14px] font-medium text-[#4B465D]">
              Learning Streak : 5
            </span>
            <span className="text-[16px]" role="img" aria-label="streak flame">
              🔥
            </span>
          </div>
        </div>

        {/* 3 Stat Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Card 1: ANIMATION */}
          <div
            className="flex flex-col rounded-[15px] p-6 border transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(188, 255, 173, 0.35)",
              borderColor: "rgba(126, 218, 132, 0.45)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg
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
            <div className="my-3 font-dm-serif text-[56px] font-normal leading-none text-[#000000]">
              {animationsCount}
            </div>
            <div className="text-[13px] text-[#4B465D]">
              Generated animations
            </div>
          </div>

          {/* Card 2: QUIZZES */}
          <div
            className="flex flex-col rounded-[15px] p-6 border transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(255, 164, 226, 0.29)",
              borderColor: "rgba(244, 95, 197, 0.35)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg
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
            <div className="my-3 font-dm-serif text-[56px] font-normal leading-none text-[#000000]">
              {quizzesCount}
            </div>
            <div className="text-[13px] text-[#4B465D]">
              Interactive practice quizzes
            </div>
          </div>

          {/* Card 3: FLASHCARDS */}
          <div
            className="flex flex-col rounded-[15px] p-6 border transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(208, 237, 250, 0.48)",
              borderColor: "rgba(61, 83, 208, 0.25)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg
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
            <div className="my-3 font-dm-serif text-[56px] font-normal leading-none text-[#000000]">
              {flashcardsCount}
            </div>
            <div className="text-[13px] text-[#4B465D]">
              Active recall study decks
            </div>
          </div>
        </div>
      </section>

      {/* RECENT SESSION Section */}
      <section className="flex flex-col gap-4" aria-label="Recent session">
        <div>
          <span className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#756A6A]">
            RECENT SESSION
          </span>
          <h2 className="mt-0.5 font-baskervville text-[38px] font-bold leading-tight text-[#000000]">
            Resume Studying
          </h2>
        </div>

        {/* Newton's Second Law Card */}
        <div className="flex flex-col rounded-[16px] bg-white p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {/* Card Top Row */}
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#E8F8E5] px-3.5 py-1 text-[13px] font-medium text-[#2E7D32]">
              Animation
            </span>
            <span className="text-[13px] text-[#756A6A]">
              2 mins remaining
            </span>
          </div>

          {/* Subject Title */}
          <h3 className="mt-3.5 font-baskervville text-[17px] font-semibold text-[#000000]">
            Newton’s Second Law of Motion
          </h3>

          {/* Progress Bar */}
          <div className="mt-2.5 h-[3.5px] w-full max-w-[620px] rounded-full bg-[#D1D5DB] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: "38%",
                backgroundColor: "#7665F5",
              }}
            />
          </div>

          {/* Continue Watching Button */}
          <div className="mt-5 flex justify-end">
            <Link
              href="/student/animations"
              className="inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-[13.5px] font-medium text-[#4B465D] transition-colors hover:bg-[#E5E5E5]"
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
    </div>
  );
}

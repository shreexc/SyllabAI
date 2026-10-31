"use client";

import Image from "next/image";
import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function StudentDashboard() {
  const { user } = useCurrentUser();
  const firstName = user?.first_name || "Namrata";
  const animationsCount = 0;
  const quizzesCount = 0;
  const flashcardsCount = 0;

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
          <h1 className="mt-1.5 font-baskervville text-[38px] font-semibold leading-[1.15] text-[#000000]">
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
              Learning Streak : 0
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

        <div
          className="flex min-h-[180px] flex-col items-center justify-center rounded-[15px] border border-dashed border-[#B3B3B3] bg-white p-8 text-center"
          role="status"
        >
          <h3 className="font-baskervville text-[22px] font-semibold text-[#30285B]">
            No studies started yet
          </h3>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-[#756A6A]">
            Your recent learning sessions will appear here when you start studying.
          </p>
        </div>
      </section>
    </div>
  );
}

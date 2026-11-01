"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getDashboard } from "@/lib/learning-api";
import type { DashboardSummary } from "@/types/learning";

export function TeacherDashboard() {
  const { user } = useCurrentUser();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboard("teacher");
      setSummary(data.summary || {});
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  if (loading) return <LoadingSkeleton type="dashboard" />;
  if (error)   return <ErrorState message={error} onRetry={fetchDashboardData} />;

  const animationsCount = summary?.animations_count ?? 0;
  const quizzesCount    = summary?.quizzes_count    ?? 0;
  const resourcesCount  = summary?.resources_count  ?? 0;
  const flashcardsCount = summary?.flashcards_count ?? 0;

  const firstName = user?.first_name || "Teacher";

  return (
    /* Outer wrapper mirrors StudentDashboard: flex-col gap-6 font-ui */
    <div className="flex flex-col gap-6 font-ui">

      {/* ── Welcome Banner ─────────────────────────────────────────────── */}
      <section
        className="flex items-center justify-between rounded-[16px] bg-white px-9 py-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        aria-label="Welcome teaching banner"
      >
        <div className="max-w-[580px]">
          {/* Eyebrow */}
          <span
            className="block text-[13px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: "#7665F5" }}
          >
            YOUR STUDY SPACE
          </span>

          {/* Heading — Baskervville semibold per Figma */}
          <h1 className="mt-1.5 font-baskervville text-[38px] font-semibold leading-[1.15] text-[#000000]">
            Welcome back,<br />
            <span style={{ color: "#7665F5" }}>{firstName}.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-[15px] leading-relaxed text-[#756A6A]">
            Prepare smarter study tools for your students from any document or syllabus.
          </p>
        </div>

        {/* Banner illustration */}
        <div className="flex flex-shrink-0 items-center justify-center">
          <Image
            src="/images/study-banner-art-user.png"
            alt="Teaching workspace illustration"
            width={220}
            height={155}
            priority
            className="object-contain"
          />
        </div>
      </section>

      {/* ── Teaching Overview ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-4" aria-label="Teaching overview statistics">
        {/* Section heading */}
        <div>
          <span className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#756A6A]">
            WORKSPACE SUMMARY
          </span>
          <h2 className="mt-0.5 font-baskervville text-[38px] font-bold leading-tight text-[#000000]">
            Teaching Overview
          </h2>
        </div>

        {/* Teacher metrics use the same stat-card scale and palette as the student dashboard. */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* ANIMATION */}
          <div
            className="flex flex-col rounded-[15px] border border-[#D7D2DF] p-6 transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(188,255,173,0.35)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#374151" strokeWidth="1.6">
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
            <div className="text-[13px] text-[#4B465D]">Generated animations</div>
          </div>

          {/* QUIZZES */}
          <div
            className="flex flex-col rounded-[15px] border border-[#D7D2DF] p-6 transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(255,164,226,0.29)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="7" y="5" width="18" height="22" rx="3" />
                <path d="M11 11h2" /><path d="M15 11h6" />
                <path d="M11 16h2" /><path d="M15 16h6" />
                <path d="M11 21h2" /><path d="M15 21h6" />
              </svg>
              <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[#374151]">
                QUIZZES
              </span>
            </div>
            <div className="my-3 font-dm-serif text-[56px] font-normal leading-none text-[#000000]">
              {quizzesCount}
            </div>
            <div className="text-[13px] text-[#4B465D]">Ready-to-publish quizzes</div>
          </div>

          {/* RESOURCES */}
          <div
            className="flex flex-col rounded-[15px] border border-[#D7D2DF] p-6 transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(255,190,161,0.48)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5h8l6 6v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
                <polyline points="17 5 17 11 23 11" />
              </svg>
              <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[#374151]">
                RESOURCES
              </span>
            </div>
            <div className="my-3 font-dm-serif text-[56px] font-normal leading-none text-[#000000]">
              {resourcesCount}
            </div>
            <div className="text-[13px] text-[#4B465D]">Uploaded teaching materials</div>
          </div>

          {/* FLASHCARDS */}
          <div
            className="flex flex-col rounded-[15px] border border-[#D7D2DF] p-6 transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(208,237,250,0.48)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 24L12 8h13l-5 16H7z" />
              </svg>
              <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[#374151]">
                FLASHCARDS
              </span>
            </div>
            <div className="my-3 font-dm-serif text-[56px] font-normal leading-none text-[#000000]">
              {flashcardsCount}
            </div>
            <div className="text-[13px] text-[#4B465D]">Active recall sets</div>
          </div>
        </div>
      </section>

      {/* ── Active Classroom Groups ────────────────────────────────────── */}
      <section className="flex flex-col gap-4" aria-label="Active classroom groups">
        {/* Section heading */}
        <div>
          <span className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#756A6A]">
            MANAGEMENT
          </span>
          <h2 className="mt-0.5 font-baskervville text-[38px] font-bold leading-tight text-[#000000]">
            Active Classroom Groups
          </h2>
        </div>

        {/* Purple-themed empty state — mirrors student "Resume Studying" placeholder */}
        <div
          className="flex min-h-[180px] flex-col items-center justify-center gap-5 rounded-[15px] border border-dashed border-[#B3B3B3] bg-white p-8 text-center"
          role="status"
        >
          {/* Icon circle */}
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "#EDE9FE" }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7665F5"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="13" rx="2" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
              <path d="M7 9h3" />
              <path d="M14 9h3" />
            </svg>
          </div>

          {/* Copy */}
          <div className="flex flex-col gap-2">
            <h3
              className="text-[22px] font-semibold"
              style={{ fontFamily: "'Baskervville', Georgia, serif", color: "#30285B" }}
            >
              No classroom groups yet
            </h3>
            <p className="mx-auto max-w-md text-[14px] leading-relaxed text-[#756A6A]">
              Create your first classroom to organise students, share quizzes and track their progress in one place.
            </p>
          </div>

          {/* Purple CTA button */}
          <Link
            href="/teacher/classes"
            className="inline-flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(90deg, #806CF4 0%, #9E8FFA 55%, #B8A8F8 100%)",
            }}
          >
            + Create a Classroom
          </Link>
        </div>
      </section>
    </div>
  );
}

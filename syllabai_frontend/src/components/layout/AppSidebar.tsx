"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types/learning";

interface AppSidebarProps {
  role: UserRole;
  onSignOut: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ role, onSignOut, isOpen = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const links = [
    { name: "Overview", icon: "⌂", href: `/${role}/dashboard` },
    { name: "Prepare Material", icon: "✧", href: `/${role}/prepare` },
    { name: "Notes", icon: "▤", href: `/${role}/notes` },
    { name: "Quizzes", icon: "✦", href: `/${role}/quizzes` },
    { name: "Flashcards", icon: "▱", href: `/${role}/flashcards` },
    { name: "Images", icon: "▧", href: `/${role}/images` },
    { name: "Animations", icon: "▷", href: `/${role}/animations` },
    { name: "History", icon: "◷", href: `/${role}/history` },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`dashboard-sidebar ${isOpen ? "dashboard-sidebar--mobile-open" : ""}`}
        aria-label={`${role === "teacher" ? "Teacher" : "Student"} navigation`}
      >
        <div className="sidebar-top">
          <Link
            href={`/${role}/dashboard`}
            className="brand-lockup"
            aria-label="SyllabAI home"
            onClick={onClose}
          >
            <span className="brand-mark">s.</span>
            <span>SyllabAI</span>
          </Link>
          <span className="sidebar-label">
            {role === "teacher" ? "TEACHER SPACE" : "STUDENT SPACE"}
          </span>
        </div>

        <nav className="side-nav" aria-label="Main menu">
          {links.map((link) => {
            const isActive =
              link.href === `/${role}/dashboard`
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`side-link ${isActive ? "side-link--active" : ""}`}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-section-divider" />
          <Link
            href={`/${role}/profile`}
            className={`side-link ${pathname.startsWith(`/${role}/profile`) ? "side-link--active" : ""}`}
            onClick={onClose}
          >
            <span aria-hidden="true">◉</span>
            My Profile
          </Link>
          <button
            type="button"
            className="signout-button"
            onClick={() => {
              if (onClose) onClose();
              onSignOut();
            }}
          >
            ↪ &nbsp; Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

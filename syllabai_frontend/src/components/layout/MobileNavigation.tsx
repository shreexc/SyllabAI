"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import type { UserRole } from "@/types/learning";

interface MobileNavigationProps {
  role: UserRole;
}

export function MobileNavigation({ role }: MobileNavigationProps) {
  const pathname = usePathname();

  const items = [
    { label: "Home", icon: "⌂", href: `/${role}/dashboard` },
    { label: "Prepare", icon: "✧", href: `/${role}/prepare` },
    { label: "Notes", icon: "▤", href: `/${role}/notes` },
    { label: "Quizzes", icon: "✦", href: `/${role}/quizzes` },
    { label: "Profile", icon: "◉", href: `/${role}/profile` },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {items.map((item) => {
        const isActive =
          item.href === `/${role}/dashboard`
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`mobile-nav-item ${isActive ? "mobile-nav-item--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="mobile-nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

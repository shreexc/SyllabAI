"use client";

import Link from "next/link";
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

  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : user?.first_name
      ? user.first_name[0].toUpperCase()
      : "U";

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-hamburger"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
        >
          ☰
        </button>
        <form onSubmit={handleSearchSubmit} className="topbar-search-form" role="search">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learning materials..."
            className="topbar-search-input"
            aria-label="Search learning materials"
          />
        </form>
      </div>

      <div className="topbar-right">
        <Link
          href={`/${role}/prepare`}
          className="topbar-prepare-btn"
          aria-label="Prepare new material"
        >
          <span>✧</span> Prepare
        </Link>
        <div className="topbar-divider" />
        <Link
          href={`/${role}/profile`}
          className="profile-chip"
          aria-label="View profile"
        >
          <span className="mini-avatar" aria-hidden="true">{initials}</span>
          <span className="profile-name">
            {user?.first_name ? `${user.first_name} ${user.last_name}` : "My Profile"}
          </span>
          <span className="chevron" aria-hidden="true">⌄</span>
        </Link>
      </div>
    </header>
  );
}

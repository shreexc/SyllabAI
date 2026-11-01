"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { api, ApiRequestError } from "@/lib/api";
import { getDashboard } from "@/lib/learning-api";
import type { User, UserRole } from "@/types/auth";
import type { DashboardSummary } from "@/types/learning";

interface ProfilePageProps {
  role: UserRole;
}

export function ProfilePage({ role }: ProfilePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [profileRes, dashRes] = await Promise.all([
          api.get<{ user: User }>(`/api/v1/${role}/profile/`),
          getDashboard(role).catch(() => ({ summary: {} })),
        ]);
        if (!mounted) return;
        setUser(profileRes.user);
        setFirstName(profileRes.user.first_name);
        setLastName(profileRes.user.last_name);
        setStats(dashRes.summary);
      } catch (caught: unknown) {
        if (!mounted) return;
        setError(
          caught instanceof ApiRequestError && caught.status === 403
            ? "This account does not have permission to view this profile."
            : caught instanceof Error
            ? caught.message
            : "Unable to load profile.",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void loadData();
    return () => {
      mounted = false;
    };
  }, [role]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last names are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.patch<{ user: User }>(`/api/v1/${role}/profile/`, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      setUser(res.user);
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading" style={{ padding: "40px 0" }}>
        <p>Loading your profile details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-error" role="alert" style={{ margin: "24px 0" }}>
        {error}
      </div>
    );
  }

  if (!user) return null;

  const initials = `${user.first_name[0] || ""}${user.last_name[0] || ""}`.toUpperCase() ||
    user.email.slice(0, 2).toUpperCase();
  const memberSince = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(user.date_joined));

  return (
    <div className="profile-container account-profile-page" style={{ width: "100%", maxWidth: "1016px", margin: "0 auto" }}>
      <PageHeader
        eyebrow="ACCOUNT OVERVIEW"
        title="Your Profile"
        description="View and update your personal information and check your activity statistics."
      />

      <section className="account-profile-summary" aria-label="Profile details">
        <div className="account-profile-identity">
          <div className="profile-avatar account-profile-avatar" aria-label={`Profile initials ${initials}`}>
            {initials}
          </div>
          <div className="account-profile-identity-copy">
            <h2>{user.first_name} {user.last_name}</h2>
            <p>{user.email}</p>
            <span className={`account-role-badge${role === "student" ? " account-role-badge--student" : ""}`}>
              {role === "teacher" ? "Educator" : "Student"}
            </span>
          </div>
        </div>

        <div className="account-profile-details">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="account-edit-button"
          >
            {!isEditing && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 5 4 4M4 20l4.2-.8L19 8.4 15.6 5 4.8 15.8 4 20Z" />
              </svg>
            )}
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>

          {isEditing ? (
            <form onSubmit={handleSave} className="account-profile-edit-form">
              <div className="field-row">
                <div className="form-field">
                  <label className="field-label" htmlFor="first_name">First Name</label>
                  <input id="first_name" type="text" className="field-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="form-field">
                  <label className="field-label" htmlFor="last_name">Last Name</label>
                  <input id="last_name" type="text" className="field-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
              <p>Email and role cannot be changed through profile settings.</p>
              <div className="account-edit-actions">
                <button type="submit" disabled={saving} className="account-save-button">
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="account-cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="account-details-grid">
              <div><dt>First Name</dt><dd>{user.first_name}</dd></div>
              <div><dt>Last Name</dt><dd>{user.last_name}</dd></div>
              <div><dt>Email</dt><dd>{user.email}</dd></div>
              <div><dt>Account Role</dt><dd>{user.role === "teacher" ? "Educator" : "Student"} (Protected)</dd></div>
              <div><dt>Member Since</dt><dd>{memberSince}</dd></div>
              <div><dt>Account Security</dt><dd>Protected with Secure JWT Cookies</dd></div>
            </dl>
          )}
        </div>
      </section>

      {/* Statistics section — same account-progress-card anatomy for both roles */}
      <section className="account-progress-section">
        <div className="account-section-heading">
          <span>{role === "teacher" ? "TEACHING STATISTICS" : "LEARNING STATISTICS"}</span>
          <h2>{role === "teacher" ? "Your Teaching Stats" : "Your Progress"}</h2>
        </div>
        <div className="account-progress-grid" style={role === "teacher" ? { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" } : {}}>
          {role === "teacher" ? (
            <>
              <Link href="/teacher/animations" className="account-progress-card account-progress-card--animation">
                <span>Animations Created</span>
                <strong>{stats?.animations_count ?? 0}</strong>
                <span className="account-progress-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link href="/teacher/quizzes" className="account-progress-card account-progress-card--quiz">
                <span>Quizzes Created</span>
                <strong>{stats?.quizzes_count ?? 0}</strong>
                <span className="account-progress-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link href="/teacher/prepare" className="account-progress-card account-progress-card--resources">
                <span>Teaching Resources</span>
                <strong>{stats?.resources_count ?? 0}</strong>
                <span className="account-progress-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link href="/teacher/flashcards" className="account-progress-card account-progress-card--flashcards">
                <span>Flashcard Decks</span>
                <strong>{stats?.flashcards_count ?? 0}</strong>
                <span className="account-progress-arrow" aria-hidden="true">↗</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/student/quizzes" className="account-progress-card account-progress-card--quiz">
                <span>Quizzes Completed</span><strong>0</strong><span className="account-progress-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link href="/student/flashcards" className="account-progress-card account-progress-card--flashcards">
                <span>Flashcards Created &amp; Studied</span><strong>0</strong><span className="account-progress-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link href="/student/animations" className="account-progress-card account-progress-card--animation">
                <span>Animations Watched</span><strong>0</strong><span className="account-progress-arrow" aria-hidden="true">↗</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Security Section */}
      <section className="account-security-card">
        <div className="account-section-heading">
          <span>SECURITY AND SESSION</span>
          <h2>Account Security</h2>
        </div>
        <p>
          You are currently signed in with an HttpOnly session cookie.
        </p>
        <div className="account-security-actions">
          <button
            type="button"
            className="account-delete-button"
            onClick={() => toast.info("Account deletion is not available yet. Contact support for assistance.")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="m19 6-1 14H6L5 6" />
              <path d="M10 11v5M14 11v5" />
            </svg>
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}

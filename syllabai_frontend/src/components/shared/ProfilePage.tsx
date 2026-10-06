"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { api, ApiRequestError } from "@/lib/api";
import { getDashboard } from "@/lib/learning-api";
import type { User, UserRole } from "@/types/auth";
import type { DashboardSummary } from "@/types/learning";

interface ProfilePageProps {
  role: UserRole;
}

export function ProfilePage({ role }: ProfilePageProps) {
  const { user: currentUser } = useCurrentUser();
  const teacherAuth = useTeacherAuth();
  const studentAuth = useStudentAuth();

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

  const handleSignOut = () => {
    if (role === "teacher") {
      void teacherAuth.signOut();
    } else {
      void studentAuth.signOut();
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

  const initials = `${user.first_name.slice(0, 1)}${user.last_name.slice(0, 1)}`.toUpperCase();

  return (
    <div className="profile-container" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <PageHeader
        eyebrow="ACCOUNT OVERVIEW"
        title="Your Profile"
        description="View and update your personal information and check your activity statistics."
        backHref={`/${role}/dashboard`}
        backLabel="Dashboard"
      />

      {/* Profile Card */}
      <div className="profile-card" style={{ position: "relative", padding: "36px", border: "1px solid #e5ebe2", borderRadius: "14px", background: "#fffefa", marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
          <div className="profile-avatar" style={{ width: "64px", height: "64px", borderRadius: "50%", background: role === "teacher" ? "#e9f2e8" : "#f0edf5", color: role === "teacher" ? "#32735f" : "#62507d", display: "grid", placeItems: "center", fontSize: "24px", fontWeight: "bold", fontFamily: "var(--serif)" }}>
            {initials}
          </div>
          <div>
            <h2 style={{ margin: 0, fontFamily: "var(--serif)", fontSize: "24px", fontWeight: 400 }}>
              {user.first_name} {user.last_name}
            </h2>
            <span style={{ fontSize: "13px", color: "#77837b" }}>{user.email}</span>
            <div style={{ marginTop: "6px" }}>
              <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "12px", background: role === "teacher" ? "#e5f1e7" : "#ede8f5", color: role === "teacher" ? "#2e6853" : "#62507d", fontSize: "10px", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>
                {role === "teacher" ? "Educator Account" : "Learner Account"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{ marginLeft: "auto", padding: "8px 14px", borderRadius: "6px", border: "1px solid #dbe2d8", background: "white", fontSize: "12px", fontWeight: 600, color: "#36423b", cursor: "pointer" }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Edit Form or Information Grid */}
        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid #edf1ea", paddingTop: "24px" }}>
            <div className="field-row">
              <div className="form-field">
                <label className="field-label" htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  className="field-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label className="field-label" htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  className="field-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div style={{ fontSize: "11px", color: "#8a948e" }}>
              Email and role cannot be changed through profile settings.
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: "10px 18px", borderRadius: "6px", background: "#32735f", color: "white", border: 0, fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{ padding: "10px 16px", borderRadius: "6px", background: "transparent", border: "1px solid #dbe2d8", color: "#515e56", fontSize: "12px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", borderTop: "1px solid #edf1ea", paddingTop: "24px" }}>
            <div>
              <span style={{ display: "block", fontSize: "10px", color: "#8c9790", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>First Name</span>
              <strong style={{ display: "block", fontSize: "14px", color: "#28332d", marginTop: "4px" }}>{user.first_name}</strong>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "10px", color: "#8c9790", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Last Name</span>
              <strong style={{ display: "block", fontSize: "14px", color: "#28332d", marginTop: "4px" }}>{user.last_name}</strong>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "10px", color: "#8c9790", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Email</span>
              <span style={{ display: "block", fontSize: "14px", color: "#28332d", marginTop: "4px" }}>{user.email}</span>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "10px", color: "#8c9790", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Account Role</span>
              <span style={{ display: "block", fontSize: "14px", color: "#28332d", marginTop: "4px" }}>
                {user.role === "teacher" ? "Educator" : "Student"} (Protected)
              </span>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "10px", color: "#8c9790", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Member Since</span>
              <span style={{ display: "block", fontSize: "14px", color: "#28332d", marginTop: "4px" }}>
                {new Date(user.date_joined).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "10px", color: "#8c9790", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Account Security</span>
              <span style={{ display: "block", fontSize: "14px", color: "#28332d", marginTop: "4px" }}>
                Protected with Secure JWT Cookies
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Learning Statistics for Student / Creation Stats for Teacher */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 400, marginBottom: "16px" }}>
          {role === "teacher" ? "Teaching Material Stats" : "Learning Statistics"}
        </h3>
        <div className="stat-cards-grid">
          {role === "teacher" ? (
            <>
              <StatCard label="Resources" value={stats?.resources_count ?? 0} icon="🗎" tone="mint" />
              <StatCard label="Quizzes Created" value={stats?.quizzes_count ?? 0} icon="✦" tone="peach" />
              <StatCard label="Flashcard Decks" value={stats?.flashcards_count ?? 0} icon="▱" tone="lavender" />
              <StatCard label="Short Notes" value={stats?.notes_count ?? 0} icon="▤" tone="blue" />
            </>
          ) : (
            <>
              <StatCard label="Notes Studied" value={stats?.notes_count ?? 0} icon="▤" tone="mint" />
              <StatCard label="Quizzes Ready" value={stats?.quizzes_count ?? 0} icon="✦" tone="peach" />
              <StatCard label="Flashcards" value={stats?.flashcards_count ?? 0} icon="▱" tone="lavender" />
              <StatCard label="Animations" value={stats?.animations_count ?? 0} icon="▷" tone="blue" />
            </>
          )}
        </div>
      </div>

      {/* Security Section */}
      <div style={{ padding: "24px", border: "1px solid #e7ebe3", borderRadius: "12px", background: "#fffefa", marginBottom: "40px" }}>
        <h3 style={{ margin: "0 0 8px", fontFamily: "var(--serif)", fontSize: "19px", fontWeight: 400 }}>Security & Session</h3>
        <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#77827a" }}>
          You are currently signed in with an HttpOnly session cookie.
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="signout-button"
          style={{ display: "inline-block", width: "auto", padding: "8px 16px", borderRadius: "6px", background: "#fff4f2", color: "#9c352a", fontWeight: 600, border: "1px solid #f2c7c2" }}
        >
          Sign out of account ↪
        </button>
      </div>
    </div>
  );
}

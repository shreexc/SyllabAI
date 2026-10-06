"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types/auth";

const spaceLabel: Record<UserRole, string> = {
  teacher: "Teaching space",
  student: "Learning space",
};

export function LandingNavigation() {
  const { user } = useCurrentUser();
  const [signedOut, setSignedOut] = useState(false);
  const role = !signedOut ? user?.role : undefined;
  const dashboardHref = role ? ROUTES[role].dashboard : ROUTES.home;

  async function signOut() {
    try {
      await logout();
      setSignedOut(true);
      toast.success("You’ve signed out", { description: "See you next time." });
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not sign out. Please try again.", {
        action: {
          label: "Try again",
          onClick: () => void signOut(),
        },
      });
    }
  }

  return (
    <nav className={`landing-nav${role ? " landing-nav--authenticated" : ""}`} aria-label="Main navigation">
      <Link href={dashboardHref} className="brand-lockup" aria-label={role ? `${spaceLabel[role]} home` : "SyllabAI home"}>
        <span className="brand-mark">s.</span><span>SyllabAI</span>
      </Link>
      {role ? (
        <div className="landing-nav-actions">
          <Link className="landing-dashboard-link" href={ROUTES[role].dashboard}>{spaceLabel[role]} <span>↗</span></Link>
          <Link className="landing-profile-link" href={`/${role}/profile`}>Profile</Link>
          <button className="landing-signout" type="button" onClick={() => void signOut()}>Sign out</button>
        </div>
      ) : (
        <div className="landing-nav-actions">
          <Link href="/login">Sign in</Link>
          <Link href="/register" className="nav-cta">Get started <span>↗</span></Link>
        </div>
      )}
    </nav>
  );
}

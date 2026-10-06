"use client";

import { useCallback, useEffect, useState } from "react";
import { currentUser } from "@/lib/auth";
import type { User } from "@/types/auth";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUser(await currentUser());
    } catch (caught) {
      setUser(null);
      setError(caught instanceof Error ? caught.message : "Could not load your account.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    currentUser().then((current) => {
      if (active) setUser(current);
    }).catch((caught: unknown) => {
      if (active) {
        setUser(null);
        setError(caught instanceof Error ? caught.message : "Could not load your account.");
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);
  return { user, loading, error, refreshUser };
}

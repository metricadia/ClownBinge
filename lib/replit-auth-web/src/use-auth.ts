import { useState, useEffect, useCallback } from "react";
import type { AuthUser } from "@workspace/api-client-react";

export type { AuthUser };

const DEV_SID_KEY = "cb_dev_sid";

function getDevSid(): string | null {
  try {
    return localStorage.getItem(DEV_SID_KEY);
  } catch {
    return null;
  }
}

function buildAuthHeaders(sid?: string | null): Record<string, string> {
  const token = sid ?? getDevSid();
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const res = await fetch("/api/auth/user", {
        credentials: "include",
        headers: buildAuthHeaders(),
      });

      if (!res.ok && (res.status === 401 || res.status === 403)) {
        if (import.meta.env.DEV) {
          try {
            const refreshRes = await fetch("/api/dev-login", { credentials: "include" });
            if (refreshRes.ok) {
              const data = await refreshRes.json() as { ok: boolean; sid: string };
              if (data.ok && data.sid) {
                localStorage.setItem(DEV_SID_KEY, data.sid);
                const retryRes = await fetch("/api/auth/user", {
                  credentials: "include",
                  headers: buildAuthHeaders(data.sid),
                });
                if (retryRes.ok) {
                  const retryData = await retryRes.json() as { user: AuthUser | null };
                  if (!cancelled) {
                    setUser(retryData.user ?? null);
                    setIsLoading(false);
                    return;
                  }
                }
              }
            }
          } catch {
          }
        }
        if (!cancelled) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      if (res.ok) {
        const data = await res.json() as { user: AuthUser | null };
        if (!cancelled) {
          setUser(data.user ?? null);
          setIsLoading(false);
        }
      } else {
        if (!cancelled) {
          setUser(null);
          setIsLoading(false);
        }
      }
    }

    checkAuth().catch(() => {
      if (!cancelled) {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(() => {
    const base = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";
    window.location.href = `/api/login?returnTo=${encodeURIComponent(base)}`;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(DEV_SID_KEY);
    } catch {}
    window.location.href = "/api/logout";
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}

export { DEV_SID_KEY };

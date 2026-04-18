/**
 * Self-hosted CB member auth context.
 * Replaces @clerk/react entirely.
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface CbUser {
  id: number;
  email: string;
  name: string | null;
  emailVerified: boolean;
}

interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: CbUser | null;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  isLoaded: false,
  isSignedIn: false,
  user: null,
  signOut: async () => {},
  refresh: async () => {},
});

const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<CbUser | null>(null);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/auth/me`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const signOut = useCallback(async () => {
    await fetch(`${apiBase}/api/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoaded,
      isSignedIn: !!user,
      user,
      signOut,
      refresh: fetchMe,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

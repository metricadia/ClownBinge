import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface AdminContextValue {
  isAdmin: boolean;
  checking: boolean;
  login: (password: string) => Promise<"ok" | "wrong" | "error">;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  checking: true,
  login: async () => "error",
  logout: async () => {},
});

export function useAdmin() {
  return useContext(AdminContext);
}

function getHeaders(): Record<string, string> {
  const token = sessionStorage.getItem("metricadia_token");
  return token ? { "X-Metricadia-Token": token } : {};
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("metricadia_authenticated") === "true") {
      setIsAdmin(true);
      setChecking(false);
      return;
    }
    fetch("/api/metricadia/auth-status", { credentials: "include", headers: getHeaders() })
      .then((r) => r.json())
      .then((d) => { setIsAdmin(!!d.authenticated); setChecking(false); })
      .catch(() => { setIsAdmin(false); setChecking(false); });
  }, []);

  const login = useCallback(async (password: string): Promise<"ok" | "wrong" | "error"> => {
    try {
      const res = await fetch("/api/metricadia/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) return "wrong";
      if (!res.ok) return "error";
      const data = await res.json();
      if (data.token) sessionStorage.setItem("metricadia_token", data.token);
      sessionStorage.setItem("metricadia_authenticated", "true");
      setIsAdmin(true);
      return "ok";
    } catch {
      return "error";
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/metricadia/logout", {
      method: "POST",
      credentials: "include",
      headers: getHeaders(),
    }).catch(() => {});
    sessionStorage.removeItem("metricadia_token");
    sessionStorage.removeItem("metricadia_authenticated");
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, checking, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

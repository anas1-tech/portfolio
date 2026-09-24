import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/api/endpoints";
import { tokenStore } from "@/api/client";

interface AuthValue {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Restore the session if a token is already stored.
  useEffect(() => {
    if (!tokenStore.get()) return;
    api
      .me()
      .then((r) => setIsAdmin(r.is_admin))
      .catch(() => setIsAdmin(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { token } = await api.login(username, password);
    tokenStore.set(token);
    setIsAdmin(true);
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => undefined);
    tokenStore.set(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

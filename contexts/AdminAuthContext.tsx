"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AdminUser } from '@/api/admin/auth';
import { getMe, logout as apiLogout } from '@/api/admin/auth';

interface AuthState {
  isLoggedIn: boolean;
  user: AdminUser | null;
}

interface AuthContextValue extends AuthState {
  setAuth: (state: { user: AdminUser; token?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    getMe()
      .then(({ user: u }) => setUser(u))
      .catch(() => setUser(null));
  }, []);

  const isLoggedIn = !!user;

  const setAuth = useCallback((next: { user: AdminUser; token?: string }) => {
    setUser(next.user);
  }, []);

  const logout = useCallback(() => {
    apiLogout().catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      user,
      setAuth,
      logout,
    }),
    [isLoggedIn, user, setAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

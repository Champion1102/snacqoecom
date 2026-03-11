"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '@/api/auth';
import { getMe, logout as apiLogout } from '@/api/auth';

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  user: AuthUser | null;
}

interface AuthContextValue extends AuthState {
  setAuth: (state: { user: AuthUser; token?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMe()
      .then(({ user: u }) => setUser(u))
      .catch(() => setUser(null));
  }, []);

  const isLoggedIn = !!user;
  const userName = user?.userName ?? '';

  const setAuth = useCallback((next: { user: AuthUser; token?: string }) => {
    setUser(next.user);
  }, []);

  const logout = useCallback(() => {
    apiLogout().catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      userName,
      user,
      setAuth,
      logout,
    }),
    [isLoggedIn, userName, user, setAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

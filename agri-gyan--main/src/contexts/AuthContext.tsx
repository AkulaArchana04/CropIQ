import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, ApiUser, getStoredToken, setStoredToken } from '@/services/api';

interface AuthContextValue {
  user: ApiUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { session } = await api.auth.getSession();
      if (session) {
        setStoredToken(session.access_token);
        setUser(session.user);
      } else {
        setStoredToken(null);
        setUser(null);
      }
    } catch {
      setStoredToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const { session } = await api.auth.signUp(email, password, fullName);
    setStoredToken(session.access_token);
    setUser(session.user);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { session } = await api.auth.signIn(email, password);
    setStoredToken(session.access_token);
    setUser(session.user);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api.auth.signOut();
    } finally {
      setStoredToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, signUp, signIn, signOut }),
    [user, loading, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

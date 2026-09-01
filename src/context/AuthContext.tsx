import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { UserProfile } from '@/types';

interface AuthCtx {
  user: UserProfile | null;
  loading: boolean;
  login: (profile: UserProfile) => void;
  logout: () => void;
  updateUser: (profile: UserProfile) => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = 'les-arsani-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      login: (profile) => {
        setUser(profile);
        localStorage.setItem(KEY, JSON.stringify(profile));
      },
      logout: () => {
        setUser(null);
        localStorage.removeItem(KEY);
      },
      updateUser: (profile) => {
        setUser(profile);
        localStorage.setItem(KEY, JSON.stringify(profile));
      },
    }),
    [user, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

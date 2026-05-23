'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useCartStore } from '@/store/useCartStore';

type SessionType = typeof authClient.$Infer.Session | null;

interface AuthContextType {
  session: SessionType;
  isPending: boolean;
  refetch: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, refetch } = authClient.useSession();
  const mergeGuestCart = useCartStore((state) => state.mergeGuestCart);

  useEffect(() => {
    if (!isPending && data?.user) {
      // Trigger guest cart merge when session is active
      mergeGuestCart();
    }
  }, [data, isPending, mergeGuestCart]);

  return (
    <AuthContext.Provider value={{ session: data, isPending, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

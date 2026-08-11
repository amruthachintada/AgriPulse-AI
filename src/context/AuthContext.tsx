'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types';
import { db } from '@/lib/storage/db';
import { ttsEngine } from '@/lib/speech/tts';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
}

const PROTECTED_ROUTES = [
  '/dashboard',
  '/analyze',
  '/weather',
  '/fields',
  '/history',
  '/advisories',
  '/assistant',
  '/settings',
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const activeUser = db.getUser();
    if (activeUser && activeUser.email) {
      setUser(activeUser);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const isProtected = PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));
    if (isProtected && !user) {
      router.push('/login');
    }
  }, [pathname, user, isLoaded, router]);

  const login = (email: string, name?: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name || email.split('@')[0] || 'Farmer Friend',
      email,
      location: 'Vijayawada, Andhra Pradesh',
      createdAt: new Date().toISOString(),
    };
    db.setUser(newUser);
    setUser(newUser);
    router.push('/dashboard');
  };

  const signup = (name: string, email: string) => {
    login(email, name);
  };

  const logout = () => {
    ttsEngine.stop();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agripulse_user');
    }
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

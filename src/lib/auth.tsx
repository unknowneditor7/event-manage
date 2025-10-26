'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USERNAME = 'vishwa';
const ADMIN_PASSWORD = '1004';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
      if (storedIsAdmin) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Could not access local storage', error);
    }
    setLoading(false);
  }, []);

  const login = (username: string, pass: string): boolean => {
    if (username === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try {
        localStorage.setItem('isAdmin', 'true');
      } catch (error) {
         console.error('Could not access local storage', error);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    try {
        localStorage.removeItem('isAdmin');
    } catch (error) {
        console.error('Could not access local storage', error);
    }
    router.push('/');
  };

  useEffect(() => {
    if (!loading && !isAdmin && pathname === '/admin') {
      router.push('/login');
    }
  }, [loading, isAdmin, pathname, router]);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

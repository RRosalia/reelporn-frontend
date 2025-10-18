'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeEcho } from '@/lib/echo-config';
import AuthService from '@/lib/services/AuthService';

interface User {
  id: number;
  email: string;
  name?: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount and reconfigure Echo with auth token
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      const userData = AuthService.getUser();

      setIsAuthenticated(authenticated);
      setUser(userData);
      setIsLoading(false);

      // Reconfigure Echo with authentication token if user is logged in
      const token = AuthService.getToken();
      if (token) {
        initializeEcho(token);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await AuthService.login(email, password);
    setIsAuthenticated(true);
    setUser(data.user || null);

    // Reconfigure Echo with authentication token
    const token = AuthService.getToken();
    if (token) {
      initializeEcho(token);
      console.log('[Echo] Reconfigured after login');
    }

    return data;
  };

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);

    // Reconfigure Echo without authentication
    initializeEcho();
    console.log('[Echo] Reconfigured after logout');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    AuthService.setUser(userData);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

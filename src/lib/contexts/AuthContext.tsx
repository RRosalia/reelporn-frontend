'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeEcho } from '@/lib/echo-config';
import AuthService from '@/lib/services/AuthService';
import type { User, LoginResponse } from '@/types/User';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  refreshAuth: () => void;
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
    }

    return data;
  };

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);

    // Reconfigure Echo without authentication
    initializeEcho();
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    AuthService.setUser(userData);
  };

  const refreshAuth = () => {
    const authenticated = AuthService.isAuthenticated();
    const userData = AuthService.getUser();

    setIsAuthenticated(authenticated);
    setUser(userData);

    // Reconfigure Echo with authentication token if user is logged in
    const token = AuthService.getToken();
    if (token) {
      initializeEcho(token);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateUser,
    refreshAuth,
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

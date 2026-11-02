/**
 * Authentication Context Provider
 * Plain JavaScript (ES6+) and React implementation
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';
import { API_BASE_URL } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check existing session on mount
  const checkSession = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authService.getMe();
      if (res && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      if (error.status !== 401) setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    setAuthError(null);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    setUser(res.user);
    setAuthError(null);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser((currentUser) => currentUser ? { ...currentUser, ...updatedUser } : currentUser);
  };

  const contextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    authError,
    apiBaseUrl: API_BASE_URL,
    login,
    register,
    logout,
    updateUser,
    refreshAuth: checkSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  petOwnerType?: 'dog' | 'cat' | 'both';
  avatarUrl?: string;
  createdAt?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  petOwnerType?: 'dog' | 'cat' | 'both';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';
// Use local API for now - will switch to Cloudflare Worker in production
const API_URL = process.env.NEXT_PUBLIC_RAWGLE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3005');

// Token Management Utilities
export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const removeAuthTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const setStoredUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

// API Client with automatic token injection and refresh
export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 - Unauthorized (token expired)
    if (response.status === 401) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        // Try to refresh the token
        try {
          const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const { token: newToken, refreshToken: newRefreshToken } = await refreshResponse.json();
            setAuthToken(newToken);
            if (newRefreshToken) setRefreshToken(newRefreshToken);

            // Retry original request with new token
            headers['Authorization'] = `Bearer ${newToken}`;
            const retryResponse = await fetch(`${API_URL}${endpoint}`, {
              ...options,
              headers,
            });

            if (!retryResponse.ok) {
              throw new Error('Request failed after token refresh');
            }

            return retryResponse.json();
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          removeAuthTokens();
          window.location.href = '/auth/login';
          throw new Error('Session expired. Please login again.');
        }
      } else {
        // No refresh token, clear everything and redirect
        removeAuthTokens();
        window.location.href = '/auth/login';
        throw new Error('Unauthorized. Please login.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },

  patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status on mount
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const storedUser = getStoredUser();

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Verify token is still valid by fetching user profile
      try {
        const userData = await apiClient.get<User>('/auth/me');
        setUser(userData);
        setStoredUser(userData);
      } catch (err) {
        // Token invalid or expired
        removeAuthTokens();
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(storedUser); // Use cached user if available
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<{
        user: User;
        token: string;
        refreshToken?: string;
      }>('/auth/login', { email, password });

      // Store tokens
      setAuthToken(response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }

      // Store user
      setUser(response.user);
      setStoredUser(response.user);

      toast.success('Welcome back!', {
        description: `Logged in as ${response.user.name}`,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error('Login Failed', {
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Register function
  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<{
        user: User;
        token: string;
        refreshToken?: string;
      }>('/auth/register', data);

      // Store tokens
      setAuthToken(response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }

      // Store user
      setUser(response.user);
      setStoredUser(response.user);

      toast.success('Account Created!', {
        description: `Welcome to RAWGLE, ${response.user.name}!`,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error('Registration Failed', {
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Logout function
  const logout = useCallback(() => {
    try {
      // Call logout endpoint (don't wait for response)
      const token = getAuthToken();
      if (token) {
        apiClient.post('/auth/logout', {}).catch(() => {
          // Ignore logout endpoint errors
        });
      }

      // Clear local state and storage
      setUser(null);
      removeAuthTokens();

      toast.info('Logged Out', {
        description: 'You have been logged out successfully',
      });

      // Redirect to home
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state even if API call fails
      setUser(null);
      removeAuthTokens();
      router.push('/');
    }
  }, [router]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check auth on mount and auto-login in development
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();

      // Auto-login as demo user if not authenticated (development only)
      if (!user && !getAuthToken() && process.env.NODE_ENV === 'development') {
        try {
          console.log('[AUTH] Auto-logging in as demo user for development');
          await login('demo@rawgle.com', 'Demo1234');
        } catch (error) {
          console.log('[AUTH] Auto-login failed, user can login manually');
        }
      }
    };

    initAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export for direct usage
export { AuthContext };

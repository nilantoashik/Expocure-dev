import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api } from '@/lib/api';
import type { User, AuthResponse } from '@/types/user';

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  role?: 'developer' | 'recruiter';
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (data: SignupData) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  verifyEmail: (code: string) => Promise<void>;
  resendVerification: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get<User>('/users/me')
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    const res = await api.post<AuthResponse>('/auth/signup', data);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    setUser(res.user);
  }, []);

  const signin = useCallback(async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/signin', { email, password });
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const verifyEmail = useCallback(async (code: string) => {
    await api.post('/auth/verify-email', { code });
    setUser((prev) => prev ? { ...prev, isEmailVerified: true } : null);
  }, []);

  const resendVerification = useCallback(async () => {
    await api.post('/auth/resend-verification');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, signup, signin, logout, updateUser, verifyEmail, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

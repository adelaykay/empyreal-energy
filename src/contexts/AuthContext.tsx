'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { loginUser, logoutUser, registerUser, getUserProfile } from '@/lib/firebase/auth';
import { UserFormData, User as UserProfile } from '@/types/user';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (formData: UserFormData) => Promise<any>;
  logout: () => Promise<any>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => ({ success: false }),
  refreshUserProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserProfile = async (uid: string) => {
    const result = await getUserProfile(uid);
    if (result.success && result.data) {
      setUserProfile(result.data as UserProfile);
      setIsAdmin(result.data.role === 'admin');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.success && result.user) {
      await fetchUserProfile(result.user.uid);
    }
    return result;
  };

  const register = async (formData: UserFormData) => {
    const result = await registerUser(formData);
    if (result.success && result.user) {
      await fetchUserProfile(result.user.uid);
    }
    return result;
  };

  const logout = async () => {
    const result = await logoutUser();
    if (result.success) {
      setUserProfile(null);
      setIsAdmin(false);
    }
    return result;
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    isAdmin,
    login,
    register,
    logout,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

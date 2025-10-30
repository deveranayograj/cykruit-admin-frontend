/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, ipAddress: string, userAgent: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refetchUser: async () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      // Check if access token exists in localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Fetch user profile with the token
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      // Clear tokens if profile fetch fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string, ipAddress: string, userAgent: string ) => {
    try {
      // Backend returns { accessToken, refreshToken, user }
      const response = await apiClient.login(email, password, ipAddress, userAgent);
      
      if (response.user) {
        setUser(response.user);
        router.push("/admin/dashboard");
      } else {
        throw new Error("Login failed: Invalid response format");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  };

 const logout = async () => {
  try {
    await apiClient.logout(); // backend logout
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    setUser(null);

    // Clear cookies manually for client-side auth/middleware
    document.cookie = "accessToken=; Max-Age=0; path=/";
    document.cookie = "refreshToken=; Max-Age=0; path=/";

    router.push("/login");
  }
};


  const refetchUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Refetch user failed:", error);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refetchUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
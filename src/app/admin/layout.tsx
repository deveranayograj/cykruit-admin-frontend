"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/admin/Navbar';
import { Sidebar } from '@/components/admin/Sidebar';

// ⚠️ DISABLE AUTH - Set to true to bypass authentication during development
const DISABLE_AUTH = false;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {

    // Skip auth check if disabled
    if (DISABLE_AUTH) return;

    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Skip loading screen if auth is disabled
  if (!DISABLE_AUTH && loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Skip auth check if disabled
  if (!DISABLE_AUTH && !isAuthenticated) {
    return null;
  }

  // Use mock user if auth is disabled
  const mockUser = {
    id: "1",
    email: "superadmin@admin.com",
    firstName: "Super",
    lastName: "Admin",
    role: "SUPER_ADMIN",
    phone: "+919876543210"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        user={DISABLE_AUTH ? mockUser : user}
      />

      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="pt-16 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
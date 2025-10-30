/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Ban, RotateCcw } from 'lucide-react';
import { Breadcrumb } from '@/components/users/Breadcrumb';
import { UserInfoCard } from '@/components/users-details/UserInfoCard';
import { EmployerInfoCard } from '@/components/users-details/EmployerInfoCard';
import { JobSeekerInfoCard } from '@/components/users-details/JobSeekerInfoCard';
import { userService } from '@/services/userService';
import { useApi } from '@/hooks/useApi';
import { UserDetail } from '@/types/user';

const UserDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  
  const [userData, setUserData] = useState<UserDetail | null>(null);

  const { loading, error, execute } = useApi({
    onSuccess: (response: any) => {
      setUserData(response.data);
    }
  });

  useEffect(() => {
    if (id) {
      execute(() => userService.getUserDetail(id));
    }
  }, [id]);

  const handleSuspend = async () => {
    if (!userData) return;
    
    const reason = prompt('Please provide a reason for suspension:');
    if (reason) {
      try {
        await userService.suspendUser(userData.id, reason);
        alert('User suspended successfully!');
        window.location.reload();
      } catch (error: any) {
        alert(`Failed to suspend: ${error.message}`);
      }
    }
  };

  const handleReactivate = async () => {
    if (!userData) return;
    
    if (confirm('Are you sure you want to reactivate this user?')) {
      try {
        await userService.reactivateUser(userData.id);
        alert('User reactivated successfully!');
        window.location.reload();
      } catch (error: any) {
        alert(`Failed to reactivate: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium mb-2">Failed to load user details</p>
          <p className="text-red-600 text-sm mb-4">{error?.message || 'User not found'}</p>
          <button
            onClick={() => window.location.href = '/admin/users'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Users List
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin Dashboard', href: '/admin/dashboard' },
    { label: 'Users', href: '/admin/users' },
    { label: `${userData.firstName} ${userData.lastName}` }
  ];

  return (
    <div className="p-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        User Details: {userData.firstName} {userData.lastName}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UserInfoCard user={userData} />
        
        {userData.role === 'EMPLOYER' && userData.employer && (
          <EmployerInfoCard user={userData} />
        )}
        
        {userData.role === 'SEEKER' && userData.jobSeeker && (
          <JobSeekerInfoCard user={userData} />
        )}
      </div>

      {/* Action Buttons */}
      {userData.status === 'ACTIVE' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <button
            onClick={handleSuspend}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <Ban className="w-5 h-5" />
            Suspend User
          </button>
        </div>
      )}

      {userData.status === 'SUSPENDED' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <button
            onClick={handleReactivate}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reactivate User
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
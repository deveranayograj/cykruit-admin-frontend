"use client";

import React from 'react';
import { Mail, Phone, Calendar, User as UserIcon, Shield, AlertTriangle } from 'lucide-react';
import { UserDetail } from '@/types/user';
import { StatusBadge } from '../users/StatusBadge';
import { RoleBadge } from '../users/RoleBadge';

export const UserInfoCard: React.FC<{ user: UserDetail }> = ({ user }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">User Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{user.email}</p>
            {user.isVerified && (
              <p className="text-xs text-green-600 mt-1">✓ Verified on {formatDate(user.emailVerifiedAt)}</p>
            )}
          </div>
        </div>

        {user.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{user.phone}</p>
              {user.isPhoneVerified && (
                <p className="text-xs text-green-600 mt-1">✓ Verified</p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-400" />
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">Role:</p>
            <RoleBadge role={user.role} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-400" />
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">Status:</p>
            <StatusBadge status={user.status} />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium text-gray-900">{formatDate(user.lastLogin)}</p>
          </div>
        </div>

        {user.suspensionReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Suspension Reason</p>
                <p className="text-sm text-red-700 mt-1">{user.suspensionReason}</p>
                {user.suspendedAt && (
                  <p className="text-xs text-red-600 mt-1">Suspended on {formatDate(user.suspendedAt)}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
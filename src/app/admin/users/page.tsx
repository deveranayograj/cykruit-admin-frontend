/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Phone, AlertTriangle } from 'lucide-react';
import { Breadcrumb } from '@/components/users/Breadcrumb';
import { StatusBadge } from '@/components/users/StatusBadge';
import { RoleBadge } from '@/components/users/RoleBadge';
import { VerificationBadge } from '@/components/users/VerificationBadge';
import { Toolbar } from '@/components/users/Toolbar';
import { TableActions } from '@/components/users/TableActions';
import { Pagination } from '@/components/users/Pagination';
import { EmptyState } from '@/components/users/states/EmptyState';
import { ErrorState } from '@/components/users/states/ErrorState';
import { TableSkeleton } from '@/components/users/states/TableSkeleton';
import { userService } from '@/services/userService';
import { useApi } from '@/hooks/useApi';
import { User, RoleFilter, StatusFilter } from '@/types/user';

const ITEMS_PER_PAGE = 10;

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const UsersPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams?.get("role");
    if (roleParam) {
      setRoleFilter(roleParam.toUpperCase() as RoleFilter);
    }
    else {
      setRoleFilter('all');
    }
  }, [searchParams]);

  const { loading, error, execute } = useApi({
    onSuccess: (response: any) => {
      setUsers(response.data.data || []);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    }
  });

  // Load users
  const loadUsers = (page: number = 1) => {
    setCurrentPage(page);
    execute(() => userService.getUsersList({
      role: roleFilter,
      status: statusFilter,
      search: searchQuery,
      page,
      limit: ITEMS_PER_PAGE
    }));
  };

  useEffect(() => {
    loadUsers(1);
  }, [roleFilter, statusFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleView = (id: string) => {
    router.push(`/admin/users/${id}`);
  };

  const handleSuspend = async (id: string) => {
    const reason = prompt('Please provide a reason for suspension:');
    if (reason) {
      try {
        await userService.suspendUser(id, reason);
        alert('User suspended successfully!');
        loadUsers(currentPage);
      } catch (error: any) {
        alert(`Failed to suspend: ${error.message}`);
      }
    }
  };

  const handleActivate = async (id: string) => {
    if (confirm('Are you sure you want to reactivate this user?')) {
      try {
        await userService.reactivateUser(id);
        alert('User reactivated successfully!');
        loadUsers(currentPage);
      } catch (error: any) {
        alert(`Failed to reactivate: ${error.message}`);
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return formatDate(dateString);
  };

  const handlePageChange = (page: number) => {
    loadUsers(page);
  };

  return (
    <div className="p-6">
      <Breadcrumb />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {roleFilter === 'SEEKER' ? 'Job Seekers' : roleFilter === 'EMPLOYER' ? 'Employers' : 'All Users'}
          </h1>
          <p className="text-gray-600 mt-1">
            {pagination.total} total user{pagination.total !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Toolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <TableSkeleton />
              ) : error ? (
                <ErrorState onRetry={() => loadUsers(currentPage)} />
              ) : users.length === 0 ? (
                <EmptyState />
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.uniqueKey}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                      {user.status === 'SUSPENDED' && user.suspensionReason && (
                        <div className="flex items-start gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600">{user.suspensionReason}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <VerificationBadge isVerified={user.isVerified} label="Email" />
                        {user.phone && (
                          <VerificationBadge isVerified={user.isPhoneVerified} label="Phone" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getTimeAgo(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4">
                      <TableActions
                        user={user}
                        onView={handleView}
                        onSuspend={handleSuspend}
                        onActivate={handleActivate}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && users.length > 0 && (
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
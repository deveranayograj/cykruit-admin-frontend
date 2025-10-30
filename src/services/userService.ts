/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  UsersListResponse,
  UserDetailResponse,
  RoleFilter,
  StatusFilter
} from '@/types/user';

export const userService = {
  // Get users list with filters and pagination
  async getUsersList(params?: {
    role?: RoleFilter;
    status?: StatusFilter;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<UsersListResponse> {
    const queryParams: any = {};

    if (params?.role && params.role !== 'all') {
      queryParams.role = params.role;
    }

    if (params?.status && params.status !== 'all') {
      queryParams.status = params.status;
    }

    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }

    if (params?.page) {
      queryParams.page = params.page;
    }

    if (params?.limit) {
      queryParams.limit = params.limit;
    }

    return apiClient.get<UsersListResponse>(API_ENDPOINTS.USERS_LIST, queryParams);
  },

  // Get user detail by ID
  async getUserDetail(id: string): Promise<UserDetailResponse> {
    return apiClient.get<UserDetailResponse>(API_ENDPOINTS.USER_DETAIL(id));
  },

  // Suspend user
  async suspendUser(id: string, reason: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/admin/users/${id}/suspend`, {
      suspensionReason: reason
    });
  },

  // Reactivate user
  async reactivateUser(id: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/admin/users/${id}/reactivate`, {});
  }
};
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  JobsListResponse,
  JobDetail,
  StatusFilter,
  JobUpdateRequest,
  JobUpdateResponse,
  JobDeleteResponse,
} from "@/types/job";

// Generic API response type (matching backend structure)
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
}

export const jobService = {
  // ✅ Get Jobs list with filters (matching backend QueryJobDto)
  async getJobsList(params?: {
    page?: number;
    limit?: number;
    status?: StatusFilter;
    search?: string;
  }): Promise<JobsListResponse> {
    const query: string[] = [];

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    query.push(`page=${page}`);
    query.push(`limit=${limit}`);

    // Only send status if it's not 'all'
    if (params?.status && params.status !== "all") {
      query.push(`status=${encodeURIComponent(params.status.toUpperCase())}`);
    }

    if (params?.search) {
      query.push(`search=${encodeURIComponent(params.search)}`);
    }

    const url = `${API_ENDPOINTS.JOBS_LIST}?${query.join("&")}`;

    const response = await apiClient.get<ApiResponse<JobsListResponse>>(url);
    return response.data; // ✅ unwrap the inner data object
  },

  // ✅ Get Job detail by ID
  async getJobDetail(id: string): Promise<JobDetail> {
    const response = await apiClient.get<ApiResponse<JobDetail>>(
      API_ENDPOINTS.JOB_DETAIL(id)
    );
    return response.data; // ✅ unwrap
  },

  // ✅ Update Job
  async updateJob(id: string, data: JobUpdateRequest): Promise<JobUpdateResponse> {
    const response = await apiClient.put<ApiResponse<JobUpdateResponse>>(
      API_ENDPOINTS.JOB_DETAIL(id),
      data
    );
    return response.data; // ✅ unwrap
  },

  // ✅ Delete Job
  async deleteJob(id: string): Promise<JobDeleteResponse> {
    const response = await apiClient.delete<ApiResponse<JobDeleteResponse>>(
      API_ENDPOINTS.JOB_DETAIL(id)
    );
    return response.data; // ✅ unwrap
  },
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  ScrapedJobsListResponse,
  ScrapedJobDetail,
  ScrapedJobStatusFilter,
  CreateScrapedJobDto,
  UpdateScrapedJobDto,
  BulkCreateScrapedJobsDto,
  ScrapedJobActionResponse,
  BulkCreateResponse,
  GenerateJobsRequest,
  GenerateJobsResponse,
} from "@/types/scraped-job";

// Generic API response type (matching backend structure)
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
}

export const scrapedJobService = {
  // ✅ Get Scraped Jobs list with filters
  async getScrapedJobsList(params?: {
    page?: number;
    limit?: number;
    status?: ScrapedJobStatusFilter;
    source?: string;
    search?: string;
  }): Promise<ScrapedJobsListResponse> {
    const query: string[] = [];

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;

    query.push(`page=${page}`);
    query.push(`limit=${limit}`);

    // Only send status if it's not 'all'
    if (params?.status && params.status !== "all") {
      query.push(`status=${encodeURIComponent(params.status.toUpperCase())}`);
    }

    if (params?.source) {
      query.push(`source=${encodeURIComponent(params.source)}`);
    }

    if (params?.search) {
      query.push(`search=${encodeURIComponent(params.search)}`);
    }

    const url = `${API_ENDPOINTS.SCRAPER_JOBS}?${query.join("&")}`;

    const response = await apiClient.get<ApiResponse<ScrapedJobsListResponse>>(
      url
    );
    return response.data;
  },

  // ✅ Get Scraped Job detail by ID
  async getScrapedJobDetail(id: string): Promise<ScrapedJobDetail> {
    const response = await apiClient.get<ApiResponse<ScrapedJobDetail>>(
      API_ENDPOINTS.SCRAPER_JOB_DETAIL(id)
    );
    return response.data;
  },

  // ✅ Create single scraped job
  async createScrapedJob(
    data: CreateScrapedJobDto
  ): Promise<ScrapedJobActionResponse> {
    const response = await apiClient.post<
      ApiResponse<ScrapedJobActionResponse>
    >(API_ENDPOINTS.SCRAPER_JOBS, data);
    return response.data;
  },

  // ✅ Bulk create scraped jobs
  async bulkCreateScrapedJobs(
    data: BulkCreateScrapedJobsDto
  ): Promise<BulkCreateResponse> {
    const response = await apiClient.post<ApiResponse<BulkCreateResponse>>(
      API_ENDPOINTS.SCRAPER_JOBS_BULK,
      data
    );
    return response.data;
  },

  // ✅ Update Scraped Job
  async updateScrapedJob(
    id: string,
    data: UpdateScrapedJobDto
  ): Promise<ScrapedJobActionResponse> {
    const response = await apiClient.put<ApiResponse<ScrapedJobActionResponse>>(
      API_ENDPOINTS.SCRAPER_JOB_DETAIL(id),
      data
    );
    return response.data;
  },

  // ✅ Delete Scraped Job
  async deleteScrapedJob(id: string): Promise<ScrapedJobActionResponse> {
    const response = await apiClient.delete<
      ApiResponse<ScrapedJobActionResponse>
    >(API_ENDPOINTS.SCRAPER_JOB_DETAIL(id));
    return response.data;
  },

  // ✅ Generate Jobs (AI/Mock)
  async generateJobs(
    params: GenerateJobsRequest
  ): Promise<GenerateJobsResponse> {
    try {
      const response = await apiClient.get<ApiResponse<GenerateJobsResponse>>(
        `${API_ENDPOINTS.SCRAPER_JOB_GENERATE}?surce=${
          params.source
        }&category=${encodeURIComponent(params.category)}&count=${params.count}`
      );
      return response.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to generate jobs"
      );
    }
  },
};

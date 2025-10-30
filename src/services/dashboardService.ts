/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  StatsOverviewResponse,
  RecentActivityResponse,
  ChartDataResponse,
  ApplicationFunnelResponse,
  TopEmployersResponse,
  PendingReviewsResponse,
  AnalyticsQueryParams,
} from "@/types/dashboard";

export const dashboardService = {
  // Get stats overview
  async getStatsOverview(): Promise<StatsOverviewResponse> {
    return apiClient.get<StatsOverviewResponse>(
      API_ENDPOINTS.DASHBOARD_OVERVIEW
    );
  },

  // Get recent activity with pagination
  async getRecentActivity(params?: {
    limit?: number;
    offset?: number;
  }): Promise<RecentActivityResponse> {
    const queryParams: any = {};

    queryParams.limit = params?.limit;

    queryParams.offset = params?.offset;

    return apiClient.get<RecentActivityResponse>(
      API_ENDPOINTS.DASHBOARD_RECENT_ACTIVITY,
      queryParams
    );
  },

  // Get user growth chart data
  async getUserGrowth(
    params?: AnalyticsQueryParams
  ): Promise<ChartDataResponse> {
    const queryParams: any = {};

    if (params?.startDate) {
      queryParams.startDate = params.startDate;
    }

    if (params?.endDate) {
      queryParams.endDate = params.endDate;
    }

    if (params?.groupBy) {
      queryParams.groupBy = params.groupBy;
    }

    return apiClient.get<ChartDataResponse>(
      API_ENDPOINTS.DASHBOARD_USER_GROWTH,
      queryParams
    );
  },

  // Get job statistics chart data
  async getJobStatistics(
    params?: AnalyticsQueryParams
  ): Promise<ChartDataResponse> {
    const queryParams: any = {};

    if (params?.startDate) {
      queryParams.startDate = params.startDate;
    }

    if (params?.endDate) {
      queryParams.endDate = params.endDate;
    }

    if (params?.groupBy) {
      queryParams.groupBy = params.groupBy;
    }

    return apiClient.get<ChartDataResponse>(
      API_ENDPOINTS.DASHBOARD_JOB_STATISTICS,
      queryParams
    );
  },

  // Get application funnel data
  async getApplicationFunnel(
    params?: AnalyticsQueryParams
  ): Promise<ApplicationFunnelResponse> {
    const queryParams: any = {};

    if (params?.startDate) {
      queryParams.startDate = params.startDate;
    }

    if (params?.endDate) {
      queryParams.endDate = params.endDate;
    }

    return apiClient.get<ApplicationFunnelResponse>(
      API_ENDPOINTS.DASHBOARD_APPLICATION_FUNNEL,
      queryParams
    );
  },

  // Get top employers
  async getTopEmployers(
  limit?: number,
  params?: AnalyticsQueryParams
): Promise<TopEmployersResponse> {
  const query: Record<string, any> = {};

  query.limit = limit;

  if (params?.startDate) query.startDate = params.startDate;
  if (params?.endDate) query.endDate = params.endDate;

  return apiClient.get<TopEmployersResponse>(
    API_ENDPOINTS.DASHBOARD_TOP_EMPLOYERS,
    query
  );
},

  // Get pending reviews
  async getPendingReviews(): Promise<PendingReviewsResponse> {
    return apiClient.get<PendingReviewsResponse>(
      API_ENDPOINTS.DASHBOARD_PENDING_REVIEWS
    );
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StatsOverview {
  users: {
    total: number;
    active: number;
    growth: string;
    seekers: number;
    employers: number;
  };
  employers: {
    total: number;
    verified: number;
    pending: number;
    growth: string;
  };
  jobs: {
    total: number;
    active: number;
    draft: number;
    growth: string;
    expired: number;
  };
  applications: {
    total: number;
    pending: number;
    shortlisted: number;
    hired: number;
  };
  pendingReviews: {
    kyc: number;
    reports: number;
    jobs: number;
  };
}

export interface Activity {
  id: string;
  action: string;
  resource: string | null;
  resourceId: string | null;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  ipAddress: string | null;
  userAgent: string | null;
  oldData: any;
  newData: any;
  metadata: any;
  createdAt: string;
}

export interface RecentActivityData {
  activities: Activity[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ChartDataset {
  label: string;
  data: number[];
  color: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ApplicationFunnelStage {
  name: string;
  count: number;
  percentage?: number | string;
}

export interface ApplicationFunnelData {
  stages: ApplicationFunnelStage[];
  total: number;
}

export interface Employer {
  id: string;
  companyName: string;
  slug: string;
  companyLogo: string | null;
  industry: string;
  isVerified: boolean;
  _count: { 
    jobs: number;
  };
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  jobs: Array<{ 
    _count: { 
      applications: number;
    };
  }>;
}

export interface PendingKYC {
  id: string;
  uniqueKey: string;
  status: string;
  createdAt: string;
  employer: {
    companyName: string;
    user: {
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface PendingReport {
  id: string;
  uniqueKey: string;
  reportType: string;
  resourceId: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface PendingJob {
  id: string;
  uniqueKey: string;
  title: string;
  status: string;
  postedAt: string;
  employer: {
    companyName: string;
    user: {
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface PendingReviewsData {
  kyc: PendingKYC[];
  reports: PendingReport[];
  jobs: PendingJob[];
  summary: {
    totalKYC: number;
    totalReports: number;
    totalDraftJobs: number;
  };
}

export interface AnalyticsQueryParams {
  startDate?: string;
  endDate?: string;
  groupBy?: 'hour' | 'day' | 'week' | 'month' | 'year';
  orderBy?: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type StatsOverviewResponse = ApiResponse<StatsOverview>;
export type RecentActivityResponse = ApiResponse<RecentActivityData>;
export type ChartDataResponse = ApiResponse<ChartData>;
export type ApplicationFunnelResponse = ApiResponse<ApplicationFunnelData>;
export type TopEmployersResponse = ApiResponse<Employer[]>;
export type PendingReviewsResponse = ApiResponse<PendingReviewsData>;
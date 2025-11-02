// ============================================
// Types (Matching Backend Response)
// ============================================

export interface JobRecord {
  id: string;
  uniqueKey: string;
  slug: string;
  title: string;
  employerId: string;
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  contractDurationInMonths: number | null;
  experience: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  postedAt: string;
  publishedAt: string;
  closedAt: string | null;
  validTill: string;
  description: string;
  applyType: 'DIRECT' | 'EXTERNAL';
  applyUrl: string | null;
  views: number;
  applicationsCount: number;
  shortlistedCount: number | null;
  hiredCount: number | null;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';
  moderatedBy: string | null;
  moderatedAt: string | null;
  flaggedBy: string | null;
  flaggedAt: string | null;
  flagReason: string | null;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  locationId: string | null;
  roleId: string;
  employer: {
    id: string;
    companyName: string;
    companyLogo: string | null;
  };
  role: {
    id: string;
    name: string;
  };
  JobCategory: {
    id: string;
    name: string;
  } | null;
}

export interface JobDetail {
  id: string;
  uniqueKey: string;
  slug: string;
  title: string;
  employerId: string;
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  contractDurationInMonths: number | null;
  experience: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  postedAt: string;
  publishedAt: string;
  closedAt: string | null;
  validTill: string;
  description: string;
  applyType: 'DIRECT' | 'EXTERNAL';
  applyUrl: string | null;
  views: number;
  applicationsCount: number;
  shortlistedCount: number | null;
  hiredCount: number | null;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';
  moderatedBy: string | null;
  moderatedAt: string | null;
  flaggedBy: string | null;
  flaggedAt: string | null;
  flagReason: string | null;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  locationId: string | null;
  roleId: string;
  employer: {
    id: string;
    companyName: string;
    companyLogo: string | null;
  };
  role: {
    id: string;
    name: string;
  };
  JobCategory: {
    id: string;
    name: string;
  } | null;
}

export type StatusFilter = 'all' | 'DRAFT' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';
export type WorkModeFilter = 'all' | 'REMOTE' | 'ONSITE' | 'HYBRID';
export type EmploymentTypeFilter = 'all' | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

// API Response Types (Matching Backend)
export interface JobsListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  jobs: JobRecord[];
}

export interface JobDetailResponse {
  data: JobDetail;
}

export interface JobApproveRequest {
  jobId: string;
  remarks?: string;
}

export interface JobRejectRequest {
  jobId: string;
  rejectionReason: string;
  remarks?: string;
}

export interface JobActionResponse {
  message: string;
  jobId: string;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  uniqueKey?: string; // optional because backend may not send
  slug: string;
  title: string;
  description: string;

  // ENUMS - Keep original enum values
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  experience: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  applyType: 'DIRECT' | 'EXTERNAL';

  applyUrl?: string | null;

  // JOB STATUS ENUM - Keep original values
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';

  // Metrics
  views: number;
  applicationsCount: number;
  shortlistedCount: number | null;
  hiredCount: number | null;

  // Timestamps
  postedAt: string;
  validTill: string;
  publishedAt?: string;
  closedAt?: string | null;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: string | null;

  // Moderation fields
  moderatedBy?: string | null;
  moderatedAt?: string | null;
  flaggedBy?: string | null;
  flaggedAt?: string | null;
  flagReason?: string | null;

  // Approval system (from new backend)
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  resubmissionCount: number;
  lastResubmittedAt?: string;
  requiresApproval: boolean;
  autoApproved: boolean;
  approvalHistory?: any[];

  // Relations
  employerId?: string;
  employer: {
    id: string;
    userId?: string;
    companyName: string;
    companyLogo?: string | null;
    user?: {
      id: string;
      email: string;
      phone?: string | null;
    };
  };

  roleId?: string;
  role: {
    id: string;
    name: string;
  };

  // Category
  JobCategory?: {
    id: string;
    name: string;
  } | null;

  // Location
  locationId?: string | null;
  location?: {
    id: string;
    city?: string;
    state?: string;
    country?: string;
  };

  // Reviewer
  reviewer?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  // Skills
  skills?: Array<{
    id: string;
    name: string;
  }>;

  // Certifications
  certifications?: Array<{
    id: string;
    name: string;
  }>;

  // Screening Questions
  screeningQuestions?: Array<{
    id: string;
    question: string;
    type: string;
    options: string[];
    required: boolean;
  }>;

  // Contract
  contractDurationInMonths: number | null;
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

export interface JobUpdateRequest {
  title?: string;
  description?: string;
  workMode?: 'REMOTE' | 'ONSITE' | 'HYBRID';
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  experience?: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  status?: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';
  contractDurationInMonths?: number;
  applyType?: 'DIRECT' | 'EXTERNAL';
  applyUrl?: string;
  validTill?: string;
  roleId?: string;
  locationId?: string;
}

export interface JobUpdateResponse {
  message: string;
  data: JobDetail;
}

export interface JobDeleteResponse {
  message: string;
  jobId: string;
}
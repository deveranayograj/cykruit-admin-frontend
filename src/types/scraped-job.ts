/* eslint-disable @typescript-eslint/no-empty-object-type */
// ============================================
// Types (Matching Backend Response)
// ============================================

export interface ScrapedJobRecord {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  experience: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  source: string;
  externalJobId: string | null;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';
  scrapedAt: string;
  validTill: string;
}

export interface ScrapedJobDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  company: {
    name: string;
    logo: string | null;
    website: string | null;
    size: string | null;
    industry: string | null;
    about: string | null;
  };
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  experience: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  location: {
    id: string;
    city: string;
    state: string;
    country: string;
  } | null;
  role: {
    id: string;
    name: string;
    category: {
      id: string;
      title: string;
    } | null;
  };
  skills: Array<{
    id: string;
    name: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
  }>;
  applyUrl: string | null;
  applyType: 'DIRECT' | 'EXTERNAL';
  source: string;
  externalJobId: string | null;
  originalUrl: string | null;
  scrapedAt: string;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';
  validTill: string;
  postedAt: string;
}

export type ScrapedJobStatusFilter = 'all' | 'DRAFT' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';

// API Response Types
export interface ScrapedJobsListResponse {
  jobs: ScrapedJobRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LocationDto {
  city?: string;
  state?: string;
  country?: string;
}

export interface CreateScrapedJobDto {
  title: string;
  description: string;
  roleName: string;
  categoryName?: string;
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  experience: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companySize?: string;
  companyIndustry?: string;
  companyAbout?: string;
  location?: LocationDto;
  applyUrl: string;
  skills?: string[];
  certifications?: string[];
  source: string;
  externalJobId?: string;
  originalUrl?: string;
  validTill?: string;
}

export interface UpdateScrapedJobDto extends Partial<CreateScrapedJobDto> {}

export interface BulkCreateScrapedJobsDto {
  jobs: CreateScrapedJobDto[];
}

export interface ScrapedJobActionResponse {
  success: boolean;
  jobId?: string;
  message: string;
  alreadyExists?: boolean;
  error?: string;
}

export interface BulkCreateResponse {
  total: number;
  successful: number;
  failed: number;
  results: Array<ScrapedJobActionResponse & { jobTitle: string }>;
}

// Generate Job Types
export interface GenerateJobsRequest {
  source: string;
  category: string;
  count: number;
}

export interface GeneratedJob extends CreateScrapedJobDto {
  _tempId?: string;
  _selected?: boolean;
}
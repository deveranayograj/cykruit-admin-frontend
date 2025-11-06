/* eslint-disable @typescript-eslint/no-explicit-any */
// User Types matching backend response
export interface User {
  id: string;
  uniqueKey: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'SEEKER' | 'EMPLOYER';
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  isVerified: boolean;
  emailVerifiedAt: string | null;
  isPhoneVerified: boolean;
  phoneVerifiedAt: string | null;
  suspendedBy: string | null;
  suspendedAt: string | null;
  suspensionReason: string | null;
  lastLogin: string | null;
  lastLoginIp: string | null;
  registrationIp: string | null;
  createdAt: string;
  updatedAt: string;
  jobSeeker: JobSeeker | null;
  employer: Employer | null;
}

export interface Skill {
  id: string;
  jobSeekerId: string;
  skillId: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  skill: {
    id: string;
    name: string;
  };
}

export interface Resume {
  id: string;
  uniqueKey: string;
  url: string;
  fileName: string;
  uploadedAt: string;
}

export interface Experience {
  id: string;
  uniqueKey: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export interface Education {
  id: string;
  uniqueKey: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export interface Certification {
  id: string;
  certificationId: string;
  issueDate: string | null;
  expiryDate: string | null;
  credentialUrl: string | null;
  certification?: {
    name: string;
  };
}

export interface JobSeeker {
  id: string;
  uniqueKey: string;
  onboardingCompleted: boolean;
  profileCompletionPercentage: number;
  bio?: string;
  location?: string;
  profileImage?: string;
  github?: string;
  linkedin?: string;
  personalWebsite?: string;
  skills?: Skill[];
  resumes?: Resume[];
  experiences?: Experience[];
  educations?: Education[];
  jobSeekerCertifications?: Certification[];
}

export interface Employer {
  id: string;
  uniqueKey: string;
  companyName: string;
  slug: string;
  companyLogo: string | null;
  isVerified: boolean;
  isActive: boolean;
  onboardingStep: string;
  verifiedAt: string | null;
  suspendedAt: string | null;
}

export interface UserDetail extends User {
  employer: (Employer & {
    userId: string;
    bannerUrl: string | null;
    companyWebsite: string | null;
    industry: string;
    companyType: string;
    companySize: string;
    foundedYear: number | null;
    about: string;
    contactEmail: string;
    contactPhone: string | null;
    kycs: any[];
    jobs: any[];
  }) | null;
  
  stats?: {
    totalJobs?: number;
    totalApplicants?: number;
    totalApplications?: number;
    applicationStats?: any;
  };
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type RoleFilter = 'all' | 'SEEKER' | 'EMPLOYER';
export type StatusFilter = 'all' | 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export interface UsersListResponse {
  success: boolean;
  data: User[];
  pagination: PaginationData;
}

export interface UserDetailResponse {
  success: boolean;
  data: UserDetail;
}
// ============================================
// Types (Matching Backend Response)
// ============================================
export interface KYCRecord {
  id: string;
  employerId: string;
  companyName: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  attemptNumber: number;
  reviewedBy: {
    id: string;
    email: string;
    name: string;
  } | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  url: string;
  thumbnail: string;
  pageCount?: number;
}

export interface KYCDetail {
  id: string;
  employerId: string;
  companyName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  panCardUrl: string | null;
  incorporationCertUrl: string | null;
  gstCertUrl: string | null;
  otherDocs: string[];
  remarks: string | null;
  rejectionReason: string | null;
  reviewedBy?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  reviewedAt?: string;
  attemptNumber: number;
  createdAt: string;
  updatedAt: string;
  employer: {
    id: string;
    companyName: string;
    slug: string;
    companyLogo: string | null;
    email: string;
    phone: string | null;
    about: string;
  };
}

export type StatusFilter = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED';

// API Response Types (Matching Backend)
export interface KYCListResponse {
  data: KYCRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface KYCDetailResponse {
  data: KYCDetail;
}

export interface KYCApproveRequest {
  kycId: string;
  remarks?: string;
}

export interface KYCRejectRequest {
  kycId: string;
  rejectionReason: string;
  remarks?: string;
}

export interface KYCRejectResponse {
  message: string;
  newKycId: string;
  rejectionReason: string;
}
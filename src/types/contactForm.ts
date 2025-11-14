// src/types/contactForm.ts

export type ContactFormStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'SPAM';

export interface ContactFormRecord {
  id: string;
  fullName: string;
  email: string;
  message: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: ContactFormStatus;
  reviewedBy?: string | null; // admin id string per your schema
  reviewedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormListResponse {
  data: ContactFormRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface UpdateContactFormStatusRequest {
  status: ContactFormStatus;
  notes?: string;
}

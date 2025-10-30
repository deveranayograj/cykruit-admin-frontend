// src/types/categories.ts

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
}

// ============================================
// SKILLS
// ============================================
export interface Skill {
  id: string;
  name: string;
}

export interface CreateSkillDto {
  name: string;
}

export interface UpdateSkillDto {
  name: string;
}

// ============================================
// CERTIFICATIONS
// ============================================
export interface Certification {
  id: string;
  name: string;
  organization?: string;
  description?: string;
}

export interface CreateCertificationDto {
  name: string;
  organization?: string;
  description?: string;
}

export interface UpdateCertificationDto {
  name: string;
  organization?: string;
  description?: string;
}

// ============================================
// JOB CATEGORIES
// ============================================
export interface JobCategory {
  id: string;
  title: string;
}

export interface CreateJobCategoryDto {
  title: string;
}

export interface UpdateJobCategoryDto {
  title: string;
}

// ============================================
// ROLES
// ============================================
export interface Role {
  id: string;
  name: string;
  categoryId: string;
  category?: {
    id: string;
    title: string;
  };
}

export interface CreateRoleDto {
  name: string;
  categoryId: string;
}

export interface UpdateRoleDto {
  name: string;
  categoryId: string;
}

// ============================================
// GENERIC CATEGORY TYPES
// ============================================
export type CategoryType = 'skills' | 'certifications' | 'job-categories' | 'roles';

export interface CategoryConfig {
  type: CategoryType;
  title: string;
  singularTitle: string;
  breadcrumbLabel: string;
}
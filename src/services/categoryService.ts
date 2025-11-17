/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/categoryService.ts

import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  ApiResponse,
  Skill,
  CreateSkillDto,
  UpdateSkillDto,
  Certification,
  CreateCertificationDto,
  UpdateCertificationDto,
  JobCategory,
  CreateJobCategoryDto,
  UpdateJobCategoryDto,
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  Institute,
  CreateInstituteDto,
  UpdateInstituteDto,
} from "@/types/categories";

// ============================================
// INSTITUTES SERVICE
// ============================================
export const institutesService = {
  async getAll(params?: { page?: number; pageSize?: number; filter?: string; sort?: string; }) {
    const query: string[] = [];
    if (params?.page) query.push(`page=${params.page}`);
    if (params?.pageSize) query.push(`pageSize=${params.pageSize}`);
    if (params?.filter) query.push(`filter=${encodeURIComponent(params.filter)}`);
    if (params?.sort) query.push(`sort=${encodeURIComponent(params.sort)}`);

    const url = `${API_ENDPOINTS.META_INSTITUTES_LIST}${query.length ? `?${query.join('&')}` : ''}`;
    const response = await apiClient.get<ApiResponse<any>>(url);
    return response.data;
  },

  async create(data: CreateInstituteDto): Promise<Institute> {
    const response = await apiClient.post<ApiResponse<Institute>>(API_ENDPOINTS.META_INSTITUTE_CREATE, data);
    return response.data;
  },

  async update(id: string, data: UpdateInstituteDto): Promise<Institute> {
    const response = await apiClient.put<ApiResponse<Institute>>(API_ENDPOINTS.META_INSTITUTE_UPDATE(id), data);
    return response.data;
  },

  async verify(id: string, isVerified: boolean): Promise<Institute> {
    const response = await apiClient.put<ApiResponse<Institute>>(API_ENDPOINTS.META_INSTITUTE_VERIFY(id), { isVerified });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.META_INSTITUTE_DELETE(id));
  },
};


// ============================================
// SKILLS SERVICE
// ============================================
export const skillsService = {
  async getAll(): Promise<Skill[]> {
    const response = await apiClient.get<ApiResponse<Skill[]>>(
      API_ENDPOINTS.META_SKILLS_LIST
    );
    return response.data;
  },

  async create(data: CreateSkillDto): Promise<Skill> {
    const response = await apiClient.post<ApiResponse<Skill>>(
      API_ENDPOINTS.META_SKILL_CREATE,
      data
    );
    return response.data;
  },

  async update(id: string, data: UpdateSkillDto): Promise<Skill> {
    const response = await apiClient.put<ApiResponse<Skill>>(
      API_ENDPOINTS.META_SKILL_UPDATE(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.META_SKILL_DELETE(id)
    );
  },
};

// ============================================
// CERTIFICATIONS SERVICE
// ============================================
export const certificationsService = {
  async getAll(): Promise<Certification[]> {
    const response = await apiClient.get<ApiResponse<Certification[]>>(
      API_ENDPOINTS.META_CERTIFICATIONS_LIST
    );
    return response.data;
  },

  async create(data: CreateCertificationDto): Promise<Certification> {
    const response = await apiClient.post<ApiResponse<Certification>>(
      API_ENDPOINTS.META_CERTIFICATION_CREATE,
      data
    );
    return response.data;
  },

  async update(
    id: string,
    data: UpdateCertificationDto
  ): Promise<Certification> {
    const response = await apiClient.put<ApiResponse<Certification>>(
      API_ENDPOINTS.META_CERTIFICATION_UPDATE(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.META_CERTIFICATION_DELETE(id)
    );
  },
};

// ============================================
// JOB CATEGORIES SERVICE
// ============================================
export const jobCategoriesService = {
  async getAll(): Promise<JobCategory[]> {
    const response = await apiClient.get<ApiResponse<JobCategory[]>>(
      API_ENDPOINTS.META_JOB_CATEGORIES_LIST
    );
    return response.data;
  },

  async create(data: CreateJobCategoryDto): Promise<JobCategory> {
    const response = await apiClient.post<ApiResponse<JobCategory>>(
      API_ENDPOINTS.META_JOB_CATEGORY_CREATE,
      data
    );
    return response.data;
  },

  async update(id: string, data: UpdateJobCategoryDto): Promise<JobCategory> {
    const response = await apiClient.put<ApiResponse<JobCategory>>(
      API_ENDPOINTS.META_JOB_CATEGORY_UPDATE(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.META_JOB_CATEGORY_DELETE(id)
    );
  },
};

// ============================================
// ROLES SERVICE
// ============================================
export const rolesService = {
  async getAll(): Promise<Role[]> {
    const response = await apiClient.get<ApiResponse<Role[]>>(
      API_ENDPOINTS.META_ROLES_LIST
    );
    return response.data;
  },

  async create(data: CreateRoleDto): Promise<Role> {
    const response = await apiClient.post<ApiResponse<Role>>(
      API_ENDPOINTS.META_ROLE_CREATE,
      data
    );
    return response.data;
  },

  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    const response = await apiClient.put<ApiResponse<Role>>(
      API_ENDPOINTS.META_ROLE_UPDATE(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.META_ROLE_DELETE(id)
    );
  },
};

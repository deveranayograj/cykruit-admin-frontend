// src/services/contactFormService.ts
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  ContactFormListResponse,
  ContactFormRecord,
  UpdateContactFormStatusRequest,
} from "@/types/contactForm";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const contactFormService = {
  async getContactForms(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<ContactFormListResponse> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const sortBy = params?.sortBy ?? "createdAt";
    const order = params?.order ?? "desc";

    const query: string[] = [];
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
    query.push(`sortBy=${encodeURIComponent(sortBy)}`);
    query.push(`order=${encodeURIComponent(order)}`);

    if (params?.status && params.status !== "all") {
      query.push(`status=${encodeURIComponent(params.status)}`);
    }
    if (params?.search) {
      query.push(`search=${encodeURIComponent(params.search)}`);
    }

    const url = `${API_ENDPOINTS.CONTACT_FORMS_LIST}?${query.join("&")}`;
    const resp = await apiClient.get<ApiResponse<ContactFormListResponse>>(url);
    return resp.data;
  },

  async updateStatus(
    id: string,
    payload: UpdateContactFormStatusRequest
  ): Promise<ContactFormRecord> {
    // backend expects PATCH /admin/contact-forms/:id/status with body { status, notes }
    const url = API_ENDPOINTS.CONTACT_FORM_STATUS(id);
    const resp = await apiClient.patch<ApiResponse<ContactFormRecord>>(url, payload);
    return resp.data;
  },
};

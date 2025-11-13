import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  KYCListResponse,
  KYCDetail,
  KYCApproveRequest,
  KYCRejectRequest,
  KYCRejectResponse,
  StatusFilter,
} from "@/types/kyc";

// Generic API response type (matching backend structure)
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
}

export const kycService = {
  // ✅ Get KYC list with filters (matching backend query params)
  async getKYCList(params?: {
    page?: number;
    limit?: number;
    status?: StatusFilter;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<KYCListResponse> {
    const query: string[] = [];

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 6;
    const sortBy = params?.sortBy ?? "createdAt";
    const order = params?.order ?? "desc";

    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
    query.push(`sortBy=${encodeURIComponent(sortBy)}`);
    query.push(`order=${encodeURIComponent(order)}`);

    if (params?.status && params.status !== "all") {
      query.push(`status=${encodeURIComponent(params.status.toUpperCase())}`);
    }

    if (params?.search) {
      query.push(`search=${encodeURIComponent(params.search)}`);
    }

    const url = `${API_ENDPOINTS.KYC_LIST}?${query.join("&")}`;

    const response = await apiClient.get<ApiResponse<KYCListResponse>>(url);
    return response.data; // ✅ unwrap the inner data object
  },

  // ✅ Get KYC detail by ID
  async getKYCDetail(id: string): Promise<KYCDetail> {
    const response = await apiClient.get<ApiResponse<KYCDetail>>(
      API_ENDPOINTS.KYC_DETAIL(id)
    );
    return response.data; // ✅ unwrap
  },

  // ✅ Approve KYC - Always add timestamp
  async approveKYC(id: string, remarks?: string): Promise<KYCDetail> {
    const now = new Date();
    const formattedDateTime = now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    let finalRemarks: string;
    if (remarks && remarks.trim()) {
      // User provided remarks: [timestamp] remarks
      finalRemarks = `[${formattedDateTime}] ${remarks.trim()}`;
    } else {
      // No remarks: [timestamp] only
      finalRemarks = `[${formattedDateTime}]`;
    }

    const data: KYCApproveRequest = {
      kycId: id,
      remarks: finalRemarks,
    };

    const response = await apiClient.post<ApiResponse<KYCDetail>>(
      API_ENDPOINTS.KYC_APPROVE(),
      data
    );
    return response.data; // ✅ unwrap
  },

  // ✅ Reject KYC - Always add timestamp
  async rejectKYC(
    id: string,
    rejectionReason: string,
    remarks?: string
  ): Promise<KYCRejectResponse> {
    const now = new Date();
    const formattedDateTime = now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    let finalRemarks: string;
    if (remarks && remarks.trim()) {
      // User provided remarks: [timestamp] remarks
      finalRemarks = `[${formattedDateTime}] ${remarks.trim()}`;
    } else {
      // No remarks: [timestamp] only
      finalRemarks = `[${formattedDateTime}]`;
    }

    const data: KYCRejectRequest = {
      kycId: id,
      rejectionReason,
      remarks: finalRemarks,
    };

    const response = await apiClient.post<ApiResponse<KYCRejectResponse>>(
      API_ENDPOINTS.KYC_REJECT(),
      data
    );
    return response.data; // ✅ unwrap
  },

  // =============================
  // NEW — Get signed document URL
  // =============================
  async getKycDocument(kycId: string, docType: string) {
    const response = await apiClient.get<
      ApiResponse<{ url: string; fileName: string }>
    >(API_ENDPOINTS.KYC_DOCUMENT(kycId, docType));

    return response.data; // unwrap { url, fileName }
  },
};

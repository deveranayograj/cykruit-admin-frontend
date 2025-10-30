"use client";
import { KYCDetail } from "@/types/kyc";
import {
  Building2,
  Mail,
  Phone,
  FileText,
  Calendar,
  User,
  XCircle
} from 'lucide-react';

export const CompanyInfoCard: React.FC<{ data: KYCDetail }> = ({ data }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Company Name</p>
            <p className="font-medium text-gray-900">{data.employer?.companyName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{data.employer?.email}</p>
          </div>
        </div>

        {data.employer?.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{data.employer?.phone}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">About</p>
            <p className="font-medium text-gray-900">{data.employer?.about}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Submitted On</p>
              <p className="font-medium text-gray-900">{formatDate(data.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Attempt Number</p>
            <p className="font-medium text-gray-900">#{data.attemptNumber}</p>
          </div>
        </div>

        {data.reviewedBy && (
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Reviewed By</p>
              <p className="font-medium text-gray-900">
                {data.reviewedBy.firstName} {data.reviewedBy.lastName}
              </p>
              <p className="text-xs text-gray-500">{data.reviewedBy.email}</p>
            </div>
          </div>
        )}

        {data.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Rejection Reason</p>
                <p className="text-sm text-red-700 mt-1">{data.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {data.remarks && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Remarks</p>
                <p className="text-sm text-blue-700 mt-1">{data.remarks}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
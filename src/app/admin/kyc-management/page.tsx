/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/kyc-management/Breadcrumb";
import { StatusBadge } from "@/components/kyc-management/StatusBadge";
import { StatusFilter } from "@/types/kyc";
import { Toolbar } from "@/components/kyc-management/Toolbar";
import { TableActions } from "@/components/kyc-management/TableActions";
import { Pagination } from "@/components/kyc-management/Pagination";
import { EmptyState } from "@/components/kyc-management/states/EmptyState";
import { ErrorState } from "@/components/kyc-management/states/ErrorState";
import { TableSkeleton } from "@/components/kyc-management/states/TableSkeleton";
import { kycService } from "@/services/kycService";
import { useApi } from "@/hooks/useApi";
import { KYCRecord } from "@/types/kyc";

const KYCListContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState<KYCRecord[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const searchParams = useSearchParams();
  const pageLimit = 6;

  const { loading, error, execute } = useApi({
    onSuccess: (response: any) => {
      const kycRecords = response?.data || [];
      setRecords(kycRecords);
      if (response.pagination) {
        setTotalPages(response.pagination.pages);
        setTotalRecords(response.pagination.total);
      }
    }
  });

  // Load KYC data
  const loadKYCData = () => {
    execute(() => kycService.getKYCList({
      page: currentPage,
      limit: pageLimit,
      status: statusFilter,
      search: searchQuery
    }));
  };

  // Initial load and when filters change
  useEffect(() => {
    const statusParam = searchParams?.get("status");
    if (statusParam) {
      setStatusFilter(statusParam.toUpperCase() as StatusFilter);
    }
  }, [searchParams]);

  useEffect(() => {
    loadKYCData();
  }, [currentPage, statusFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Only reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleView = (id: string) => {
    window.location.href = `/admin/kyc-management/${id}`;
  };

  const handleApprove = async (id: string,  remarks: string) => {
    try {
      await kycService.approveKYC(id, remarks);
      alert('KYC approved successfully!');
      loadKYCData();
    } catch (error: any) {
      alert(`Failed to approve: ${error.message}`);
    }
  };

  const handleReject = async (id: string, reason: string,  remarks: string) => {
    try {
      await kycService.rejectKYC(id, reason, remarks);
      alert('KYC rejected successfully!');
      loadKYCData();
    } catch (error: any) {
      alert(`Failed to reject: ${error.message}`);
    }
  };

  const handleRetry = () => {
    loadKYCData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <Breadcrumb />

      <h1 className="text-3xl font-bold text-gray-900 mb-6">KYC Management</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Toolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attempt #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <TableSkeleton />
              ) : error ? (
                <ErrorState onRetry={handleRetry} />
              ) : records.length === 0 ? (
                <EmptyState />
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {record.employerId}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleView(record.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        {record.companyName}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.email}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={record.status as any} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.attemptNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <TableActions
                        recordId={record.id}
                        status={record.status as any}
                        onView={handleView}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && records.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalRecords={totalRecords}
            pageSize={pageLimit}
          />
        )}
      </div>
    </div>
  );
};

const KYCList: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <KYCListContent />
  </Suspense>
);

export default KYCList;
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from "next/navigation";
import { Eye, Check, X, Briefcase, Clock, Users } from 'lucide-react';
import { jobService } from "@/services/jobService";
import { useApi } from "@/hooks/useApi";
import { JobRecord, StatusFilter, WorkModeFilter, EmploymentTypeFilter } from "@/types/job";
import { Breadcrumb } from '@/components/jobs/Breadcrumb';
import { StatusBadge } from '@/components/jobs/StatusBadge';
import { WorkModeBadge } from '@/components/jobs/WorkModeBadge';
import { EmptyState } from '@/components/jobs/states/EmptyState';
import { ErrorState } from '@/components/jobs/states/ErrorState';
import { TableSkeleton } from '@/components/jobs/states/TableSkeleton';
import { Toolbar } from '@/components/jobs/Toolbar';
import { Pagination } from '@/components/jobs/Pagination';

// Main Component
const JobsListContent: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [workModeFilter, setWorkModeFilter] = useState<WorkModeFilter>('all');
    const [employmentTypeFilter, setEmploymentTypeFilter] = useState<EmploymentTypeFilter>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [jobs, setJobs] = useState<JobRecord[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const searchParams = useSearchParams();
    const pageLimit = 10;

    const { loading, error, execute } = useApi({
        onSuccess: (response: any) => {
            const jobsList = response?.jobs || [];
            setJobs(jobsList);
            setTotalPages(response?.totalPages || 1);
            setTotalRecords(response?.total || 0);
        }
    });

    // Load Jobs data from backend
    const loadJobsData = () => {
        execute(() => jobService.getJobsList({
            page: currentPage,
            limit: pageLimit,
            status: statusFilter,
            search: searchQuery
        }));
    };

    // Client-side filtering for workMode and employmentType
    const filteredJobs = useMemo(() => {
        let filtered = [...jobs];

        // Filter by work mode
        if (workModeFilter !== 'all') {
            filtered = filtered.filter(job => job.workMode === workModeFilter);
        }

        // Filter by employment type
        if (employmentTypeFilter !== 'all') {
            filtered = filtered.filter(job => job.employmentType === employmentTypeFilter);
        }

        return filtered;
    }, [jobs, workModeFilter, employmentTypeFilter]);

    // Initial load and when filters change
    useEffect(() => {
        const statusParam = searchParams?.get("status");
        if (statusParam) {
            setStatusFilter(statusParam.toUpperCase() as StatusFilter);
        } else {
            // Reset to 'all' if no status param exists
            setStatusFilter('all');
        }
    }, [searchParams]);

    // Reload data when page or status changes
    useEffect(() => {
        loadJobsData();
    }, [currentPage, statusFilter]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            loadJobsData();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset to page 1 when client-side filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [workModeFilter, employmentTypeFilter]);

    const handleView = (id: string) => {
        window.location.href = `/admin/jobs/${id}`;
    };

    const handleApprove = async (id: string) => {
        if (confirm('Are you sure you want to approve this job?')) {
            try {
                await jobService.approveJob(id);
                alert('Job approved successfully!');
                loadJobsData();
            } catch (error: any) {
                alert(`Failed to approve: ${error.message}`);
            }
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            try {
                await jobService.rejectJob(id, reason);
                alert('Job rejected successfully!');
                loadJobsData();
            } catch (error: any) {
                alert(`Failed to reject: ${error.message}`);
            }
        }
    };

    const handleRetry = () => {
        loadJobsData();
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

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">{filteredJobs.length}</span> of <span className="font-medium">{totalRecords}</span> Jobs
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Toolbar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    workModeFilter={workModeFilter}
                    setWorkModeFilter={setWorkModeFilter}
                    employmentTypeFilter={employmentTypeFilter}
                    setEmploymentTypeFilter={setEmploymentTypeFilter}
                />

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Work Mode
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applications
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Posted
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
                            ) : filteredJobs.length === 0 ? (
                                <EmptyState />
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <button
                                                    onClick={() => handleView(job.id)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer text-left"
                                                >
                                                    {job.title}
                                                </button>
                                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                    <Briefcase className="w-3 h-3" />
                                                    {job.role.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {job.employer.companyName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <WorkModeBadge mode={job.workMode} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {job.employmentType.replace('_', ' ')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={job.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Users className="w-4 h-4" />
                                                {job.applicationsCount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(job.postedAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleView(job.id)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {(job.status === 'DRAFT' || job.status === 'PENDING') && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(job.id)}
                                                            className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors cursor-pointer"
                                                            title="Approve"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(job.id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors cursor-pointer"
                                                            title="Reject"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && !error && filteredJobs.length > 0 && (
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

const JobsList: React.FC = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <JobsListContent />
    </Suspense>
);

export default JobsList;
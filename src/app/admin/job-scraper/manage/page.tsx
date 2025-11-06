/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import { ChevronRight, Search, Edit, Eye, Trash2, Briefcase, MapPin, Clock, Database, FileX, AlertCircle } from 'lucide-react';
import { scrapedJobService } from "@/services/scrapedJobService";
import { useApi } from "@/hooks/useApi";
import { ScrapedJobRecord, ScrapedJobStatusFilter } from "@/types/scraped-job";

// Breadcrumb Component
const Breadcrumb: React.FC = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-gray-900">Home</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/admin/dashboard" className="hover:text-gray-900">Admin Dashboard</Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Scraped Jobs Management</span>
    </nav>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: ScrapedJobRecord['status'] }> = ({ status }) => {
  const styles: Record<ScrapedJobRecord['status'], string> = {
    DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    EXPIRED: 'bg-orange-100 text-orange-800 border-orange-200',
    ARCHIVED: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

// Source Badge
const SourceBadge: React.FC<{ source: string }> = ({ source }) => {
  const styles: Record<string, string> = {
    indeed: 'bg-blue-100 text-blue-800',
    linkedin: 'bg-blue-100 text-blue-800',
    glassdoor: 'bg-green-100 text-green-800',
    ai: 'bg-purple-100 text-purple-800',
  };

  const displayName = source.charAt(0).toUpperCase() + source.slice(1);

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${styles[source.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
      <Database className="w-3 h-3 mr-1" />
      {displayName}
    </span>
  );
};

// Work Mode Badge
const WorkModeBadge: React.FC<{ mode: string }> = ({ mode }) => {
  const styles: Record<string, string> = {
    REMOTE: 'bg-purple-100 text-purple-800',
    ONSITE: 'bg-orange-100 text-orange-800',
    HYBRID: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${styles[mode] || 'bg-gray-100 text-gray-800'}`}>
      <MapPin className="w-3 h-3 mr-1" />
      {mode}
    </span>
  );
};

// Empty State Component
const EmptyState: React.FC = () => {
  return (
    <tr>
      <td colSpan={9} className="px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <FileX className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Scraped Jobs Found</h3>
          <p className="text-sm text-gray-500">There are no scraped jobs matching your filters.</p>
        </div>
      </td>
    </tr>
  );
};

// Error State Component
const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <tr>
      <td colSpan={9} className="px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-16 h-16 text-red-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Data</h3>
          <p className="text-sm text-gray-500 mb-4">There was an error loading the scraped jobs.</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </td>
    </tr>
  );
};

// Table Skeleton Component
const TableSkeleton: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b border-gray-200">
          <td className="px-6 py-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

// Toolbar Component
const Toolbar: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ScrapedJobStatusFilter;
  setStatusFilter: (status: ScrapedJobStatusFilter) => void;
  sourceFilter: string;
  setSourceFilter: (source: string) => void;
}> = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, sourceFilter, setSourceFilter }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ScrapedJobStatusFilter)}
          className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        {/* Source Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Sources</option>
          <option value="indeed">Indeed</option>
          <option value="linkedin">LinkedIn</option>
          <option value="glassdoor">Glassdoor</option>
          <option value="ai">AI Generated</option>
        </select>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
  pageSize: number;
}> = ({ currentPage, totalPages, onPageChange, totalRecords, pageSize }) => {
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startRecord}</span> to{' '}
          <span className="font-medium">{endRecord}</span> of{' '}
          <span className="font-medium">{totalRecords}</span> results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ScrapedJobsListContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ScrapedJobStatusFilter>('all');
  const [sourceFilter, setSourceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<ScrapedJobRecord[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const searchParams = useSearchParams();
  const pageLimit = 20;

  const { loading, error, execute } = useApi({
    onSuccess: (response: any) => {
      const jobsList = response?.jobs || [];
      setJobs(jobsList);
      setTotalPages(response?.pagination?.totalPages || 1);
      setTotalRecords(response?.pagination?.total || 0);
    }
  });

  // Load Jobs data from backend
  const loadJobsData = () => {
    execute(() => scrapedJobService.getScrapedJobsList({
      page: currentPage,
      limit: pageLimit,
      status: statusFilter,
      source: sourceFilter,
      search: searchQuery
    }));
  };

  // Initial load
  useEffect(() => {
    const statusParam = searchParams?.get("status");
    if (statusParam) {
      setStatusFilter(statusParam.toUpperCase() as ScrapedJobStatusFilter);
    }
  }, [searchParams]);

  // Reload data when filters change
  useEffect(() => {
    loadJobsData();
  }, [currentPage, statusFilter, sourceFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadJobsData();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleView = (id: string) => {
    window.location.href = `/admin/job-scraper/manage/${id}`;
  };

  const handleEdit = (id: string) => {
    window.location.href = `/admin/job-scraper/manage/${id}/edit`;
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this scraped job? This action cannot be undone.')) {
      try {
        await scrapedJobService.deleteScrapedJob(id);
        alert('Scraped job deleted successfully!');
        loadJobsData();
      } catch (error: any) {
        alert(`Failed to delete: ${error.message}`);
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
        <h1 className="text-3xl font-bold text-gray-900">Scraped Jobs Management</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/job-scraper/generate"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Generate Jobs
          </Link>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{totalRecords}</span> Total Jobs
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Toolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
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
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scraped
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Till
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
              ) : jobs.length === 0 ? (
                <EmptyState />
              ) : (
                jobs.map((job) => (
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
                          {job.experience}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {job.company}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.location}
                    </td>
                    <td className="px-6 py-4">
                      <WorkModeBadge mode={job.workMode} />
                    </td>
                    <td className="px-6 py-4">
                      <SourceBadge source={job.source} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(job.scrapedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {formatDate(job.validTill)}
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
                        <button
                          onClick={() => handleEdit(job.id)}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors cursor-pointer"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors cursor-pointer"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && jobs.length > 0 && (
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

const ScrapedJobsList: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ScrapedJobsListContent />
  </Suspense>
);

export default ScrapedJobsList;
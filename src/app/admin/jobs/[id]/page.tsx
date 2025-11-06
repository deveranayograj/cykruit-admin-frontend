/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { jobService } from "@/services/jobService";
import { useApi } from "@/hooks/useApi";
import { JobDetail } from "@/types/job";
import { Breadcrumb } from '@/components/jobs-details/Breadcrumb';
import { JobInfoCard } from '@/components/jobs-details/JobInfoCard';
import { StatisticsCard } from '@/components/jobs-details/StatisticsCard';
import { ModerationCard } from '@/components/jobs-details/ModerationCard';
import { ActionButtons } from '@/components/jobs-details/ActionButtons';
import { EmployerInfoCard } from '@/components/jobs-details/EmployerInfoCard';
import { LocationRoleCard } from '@/components/jobs-details/LocationRoleCard';
import { SkillsCard } from '@/components/jobs-details/SkillsCard';


// Main Component
const JobDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [jobData, setJobData] = useState<JobDetail | null>(null);

  const { loading, error, execute } = useApi({
    onSuccess: (response: JobDetail) => {
      setJobData(response);
    }
  });

  useEffect(() => {
    if (id) {
      execute(() => jobService.getJobDetail(id));
    }
  }, [id]);

  const handleEdit = () => {
    window.location.href = `/admin/jobs/${id}/edit`;
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await jobService.deleteJob(id);
        alert('Job Deleted!');
        window.location.href = '/admin/jobs';
      } catch (error: any) {
        alert(`Failed to delete: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium mb-2">Failed to load job details</p>
          <p className="text-red-600 text-sm mb-4">{error?.message || 'Job not found'}</p>
          <button
            onClick={() => window.location.href = '/admin/jobs'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Jobs List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb jobTitle={jobData.title} />

      <div className="mb-6">
        <Link
          href="/admin/jobs"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Jobs List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <JobInfoCard job={jobData} />
          <ModerationCard job={jobData} />
          <LocationRoleCard job={jobData} />
          <SkillsCard job={jobData} />
        </div>

        <div className="space-y-6">
          <EmployerInfoCard job={jobData} />
          <StatisticsCard job={jobData} />
          <ModerationCard job={jobData} />
          <ActionButtons
            job={jobData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
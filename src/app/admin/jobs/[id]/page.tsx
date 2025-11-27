/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* Cleaned JobDetailPage — removed duplicate ModerationCard and improved layout */

"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { jobService } from "@/services/jobService";
import { useApi } from "@/hooks/useApi";
import { JobDetail } from "@/types/job";

import { Breadcrumb } from "@/components/jobs-details/Breadcrumb";
import { JobInfoCard } from "@/components/jobs-details/JobInfoCard";
import { StatisticsCard } from "@/components/jobs-details/StatisticsCard";
import { ModerationCard } from "@/components/jobs-details/ModerationCard";
import { ActionButtons } from "@/components/jobs-details/ActionButtons";
import { EmployerInfoCard } from "@/components/jobs-details/EmployerInfoCard";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";


const JobDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [jobData, setJobData] = useState<JobDetail | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const { loading, error, execute } = useApi({
    onSuccess: (response: JobDetail) => setJobData(response)
  });

  useEffect(() => {
    if (id) execute(() => jobService.getJobDetail(id));
  }, [id]);

  const reloadJob = async () => {
    try {
      const updated = await jobService.getJobDetail(id);
      setJobData(updated);
    } catch (e) {
      // ignore
    }
  };

  const handleEdit = () => (window.location.href = `/admin/jobs/${id}/edit`);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;

    try {
      await jobService.deleteJob(id);
      alert("Job Deleted!");
      window.location.href = "/admin/jobs";
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  // Open dialogs (these are passed to ActionButtons)
  const handleApproveClick = () => setApproveDialogOpen(true);
  const handleRejectClick = () => setRejectDialogOpen(true);

  // Confirm handlers
  const handleApproveConfirm = async (_inputValue?: string, remarks?: string) => {
    try {
      await jobService.approveJob(id, remarks);
      alert("Job approved — status set to ACTIVE.");
      setApproveDialogOpen(false);
      await reloadJob();
    } catch (err: any) {
      alert(`Failed to approve: ${err?.message || err}`);
    }
  };

  const handleRejectConfirm = async (rejectionReason?: string, remarks?: string) => {
    if (!rejectionReason || !rejectionReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    try {
      await jobService.rejectJob(id, rejectionReason, remarks);
      alert("Job rejected — status set to DRAFT.");
      setRejectDialogOpen(false);
      await reloadJob();
    } catch (err: any) {
      alert(`Failed to reject: ${err?.message || err}`);
    }
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-600">Loading job details...</p>
    </div>
  );

  if (error || !jobData) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-medium mb-2">Failed to load job details</p>
        <p className="text-red-600 text-sm mb-4">{error?.message || "Job not found"}</p>
        <button
          onClick={() => (window.location.href = "/admin/jobs")}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Back to Jobs List
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <Breadcrumb jobTitle={jobData.title} />

      <div className="mb-6">
        <Link href="/admin/jobs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Back to Jobs List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE — main details */}
        <div className="lg:col-span-2 space-y-6">
          <JobInfoCard job={jobData} />
          <ModerationCard job={jobData} />
        </div>

        {/* RIGHT SIDE — meta */}
        <div className="space-y-6">
          <EmployerInfoCard job={jobData} />
          <StatisticsCard job={jobData} />

          <ActionButtons
            job={jobData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApprove={handleApproveClick}
            onReject={handleRejectClick}
          />
        </div>
      </div>

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={approveDialogOpen}
        title="Approve Job"
        message="Are you sure you want to approve this job?"
        confirmLabel="Approve"
        showInput={false}
        onCancel={() => setApproveDialogOpen(false)}
        onConfirm={handleApproveConfirm}
      />

      <ConfirmDialog
        open={rejectDialogOpen}
        title="Reject Job"
        message="Please provide a rejection reason."
        confirmLabel="Reject"
        confirmColor="bg-red-600 hover:bg-red-700"
        showInput={true}
        inputLabel="Rejection Reason"
        inputPlaceholder="Enter reason for rejection"
        onCancel={() => setRejectDialogOpen(false)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};

export default JobDetailPage;

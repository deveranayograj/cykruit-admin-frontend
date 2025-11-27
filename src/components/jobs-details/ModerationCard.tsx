/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Moderation Info Card - Enhanced Version
import { JobDetail } from "@/types/job";
import { Check, Flag, XCircle, ClipboardList, UserCheck } from "lucide-react";

export const ModerationCard: React.FC<{ job: JobDetail }> = ({ job }) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Moderation & Approval</h3>

      <div className="space-y-4">
        {/* Moderated */}
        {job.moderatedAt && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <Check className="w-4 h-4" />
              <span className="font-medium">Moderated</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p>Moderated At: {formatDate(job.moderatedAt)}</p>
              {job.moderatedBy && <p>By: Admin #{job.moderatedBy}</p>}
            </div>
          </div>
        )}

        {/* Flagged */}
        {job.flaggedAt && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <Flag className="w-4 h-4" />
              <span className="font-medium">Flagged</span>
            </div>
            <div className="text-sm text-red-700 space-y-1">
              <p>Flagged At: {formatDate(job.flaggedAt)}</p>
              {job.flaggedBy && <p>By: Admin #{job.flaggedBy}</p>}
              {job.flagReason && (
                <div>
                  <p className="font-medium">Reason:</p>
                  <p className="mt-1">{job.flagReason}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Approval */}
        {(job.approvedAt || job.rejectedAt || job.requiresApproval) && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <ClipboardList className="w-4 h-4" />
              <span className="font-medium">Approval Workflow</span>
            </div>

            <div className="text-sm text-blue-700 space-y-1">
              <p>Requires Approval: {String(job.requiresApproval)}</p>
              <p>Auto Approved: {String(job.autoApproved)}</p>
              <p>Resubmissions: {job.resubmissionCount ?? 0}</p>
              {job.lastResubmittedAt && (
                <p>Last Resubmitted: {formatDate(job.lastResubmittedAt)}</p>
              )}

              {job.approvedAt && (
                <div className="pt-2">
                  <p className="font-medium flex items-center gap-1 text-green-700">
                    <Check className="w-4 h-4" /> Approved
                  </p>
                  <p>Approved At: {formatDate(job.approvedAt)}</p>
                  {job.approvedBy && <p>By: Admin #{job.approvedBy}</p>}
                </div>
              )}

              {job.rejectedAt && (
                <div className="pt-2">
                  <p className="font-medium flex items-center gap-1 text-red-700">
                    <XCircle className="w-4 h-4" /> Rejected
                  </p>
                  <p>Rejected At: {formatDate(job.rejectedAt)}</p>
                  {job.rejectedBy && <p>By: Admin #{job.rejectedBy}</p>}
                  {job.rejectionReason && (
                    <p className="mt-1 text-red-700">Reason: {job.rejectionReason}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviewer */}
        {job.reviewer && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <UserCheck className="w-4 h-4" />
              <span className="font-medium">Reviewed By</span>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                {job.reviewer.firstName} {job.reviewer.lastName}
              </p>
              <p className="text-xs text-gray-500">{job.reviewer.email}</p>
            </div>
          </div>
        )}

        {/* Approval History */}
        {job.approvalHistory && job.approvalHistory.length > 0 && (
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="font-medium text-sm text-gray-700 mb-2">
              Approval History
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              {job.approvalHistory.map((entry: any, idx: number) => (
                <div key={idx} className="border-b border-gray-100 pb-2">
                  <p>Action: {entry.action}</p>
                  <p>By: {entry.adminId}</p>
                  <p>At: {formatDate(entry.timestamp)}</p>
                  {entry.reason && <p>Reason: {entry.reason}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
"use client";
import React from "react";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { JobDetail } from "@/types/job";

interface ActionButtonsProps {
  job: JobDetail;
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  job,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}) => {
  // Determine which moderation buttons to show
  const showApprove = job.status == "PENDING";
  const showReject = job.status == "PENDING";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-2">Actions</h3>

      <div className="flex flex-col gap-3">
        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Pencil className="w-4 h-4" /> Edit Job
        </button>

        {/* Approve Button */}
        {showApprove && (
          <button
            onClick={onApprove}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
        )}

        {/* Reject Button */}
        {showReject && (
          <button
            onClick={onReject}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Delete Job
        </button>
      </div>
    </div>
  );
};
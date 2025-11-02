// Action Buttons
import React from 'react';
import { Check, X } from 'lucide-react';
import { JobDetail } from '@/types/job';
export const ActionButtons: React.FC<{
  job: JobDetail;
  onApprove: () => void;
  onReject: () => void;
}> = ({ job, onApprove, onReject }) => {
  // Show action buttons only for DRAFT or PENDING status
  if (job.status !== 'DRAFT' && job.status !== 'PENDING') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Moderation Actions</h3>
      <div className="flex gap-4">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Check className="w-5 h-5" />
          Approve Job
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <X className="w-5 h-5" />
          Reject Job
        </button>
      </div>
    </div>
  );
};
"use client";

import { useState } from 'react';
import { KYCDetail } from "@/types/kyc";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";
import { CheckCircle, XCircle } from 'lucide-react';

export const ActionButtons: React.FC<{
  recordId: string;
  status: KYCDetail['status'];
  onApprove: (id: string, remarks: string) => void;
  onReject: (reason: string, id: string, remarks: string) => void;
}> = ({ recordId, status, onApprove, onReject }) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  if (status !== "PENDING") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-gray-600">
            This KYC application has been{' '}
            <span className={`font-semibold ${status === "APPROVED" ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsApproveDialogOpen(true)}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Approve KYC
          </button>
          <button
            onClick={() => setIsRejectDialogOpen(true)}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Reject KYC
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={isApproveDialogOpen}
        title="Confirm Approval"
        message="Are you sure you want to approve this KYC application?"
        confirmLabel="Approve"
        confirmColor="bg-green-600 hover:bg-green-700"
        onCancel={() => setIsApproveDialogOpen(false)}
        onConfirm={(inputValue, remarks) => {
          // For approve: inputValue is undefined, remarks has the timestamped value
          onApprove(recordId, remarks || '');
          setIsApproveDialogOpen(false);
        }}
      />

      <ConfirmDialog
        open={isRejectDialogOpen}
        title="Confirm Rejection"
        message="Please provide a reason before rejecting this KYC application."
        confirmLabel="Reject"
        confirmColor="bg-red-600 hover:bg-red-700"
        showInput
        inputLabel="Rejection Reason"
        inputPlaceholder="Enter reason for rejection..."
        onCancel={() => setIsRejectDialogOpen(false)}
        onConfirm={(reason, remarks) => {
          // For reject: reason has the rejection reason, remarks has the timestamped value
          if (reason) {
            onReject(reason, recordId, remarks || '');
            setIsRejectDialogOpen(false);
          }
        }}
      />
    </>
  );
};
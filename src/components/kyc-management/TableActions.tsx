import React, { useState} from 'react';
import { Eye, Check, X } from "lucide-react";
import { KYCRecord } from "@/types/kyc";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";

export const TableActions: React.FC<{
  recordId: string;
  status: KYCRecord['status'];
  onView: (id: string) => void;
  onApprove: (id: string, remarks: string) => void;
  onReject: (id: string, reason: string, remarks: string) => void;
}> = ({ recordId, status, onView, onApprove, onReject }) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onView(recordId)}
        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors cursor-pointer"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>

      {status === 'PENDING' && (
        <>
          <button
            onClick={() => setIsApproveDialogOpen(true)}
            className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors cursor-pointer"
            title="Approve"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsRejectDialogOpen(true)}
            className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors cursor-pointer"
            title="Reject"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      )}

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
            onReject(recordId, reason, remarks || '');
            setIsRejectDialogOpen(false);
          }
        }}
      />
    </div>
  );
};
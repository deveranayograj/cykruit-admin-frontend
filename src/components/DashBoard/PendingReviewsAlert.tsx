import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PendingReviewsAlertProps {
  kycCount: number;
  reportsCount: number;
  onReviewClick: () => void;
}

export function PendingReviewsAlert({ kycCount, reportsCount, onReviewClick }: PendingReviewsAlertProps) {
  if (kycCount === 0 && reportsCount === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-yellow-800 font-semibold">Pending Reviews</h3>
          <p className="text-yellow-700 text-sm mt-1">
            {kycCount} KYC applications and {reportsCount} reports need your attention
          </p>
        </div>
        <button 
          onClick={onReviewClick}
          className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 transition-colors"
        >
          Review Now
        </button>
      </div>
    </div>
  );
}
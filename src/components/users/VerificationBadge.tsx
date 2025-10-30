"use client";

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const VerificationBadge: React.FC<{
  isVerified: boolean;
  label: string;
}> = ({ isVerified, label }) => {
  return isVerified ? (
    <span className="inline-flex items-center gap-1 text-xs text-green-700">
      <CheckCircle className="w-3.5 h-3.5" />
      {label}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      <XCircle className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};
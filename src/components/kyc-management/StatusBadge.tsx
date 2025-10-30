"use client";
import React from 'react';
import { KYCRecord } from '../../types/kyc';
export const StatusBadge: React.FC<{ status: KYCRecord['status'] }> = ({ status }) => {
  
  const styles: Record<'PENDING' | 'APPROVED' | 'REJECTED', string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    APPROVED: 'bg-green-100 text-green-800 border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200'
  };


  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
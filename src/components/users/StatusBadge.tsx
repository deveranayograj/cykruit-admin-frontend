"use client";

import React from 'react';
import { CheckCircle, Clock, Ban, XCircle } from 'lucide-react';

type Status = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const styles = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    SUSPENDED: 'bg-red-100 text-red-800 border-red-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    DELETED: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const icons = {
    ACTIVE: <CheckCircle className="w-3 h-3" />,
    SUSPENDED: <Ban className="w-3 h-3" />,
    PENDING: <Clock className="w-3 h-3" />,
    DELETED: <XCircle className="w-3 h-3" />
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};
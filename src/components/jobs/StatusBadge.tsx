// Status Badge Component
import React from 'react';
import { JobRecord } from '@/types/job';
export const StatusBadge: React.FC<{ status: JobRecord['status'] }> = ({ status }) => {
    const styles: Record<JobRecord['status'], string> = {
        DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        ACTIVE: 'bg-green-100 text-green-800 border-green-200',
        EXPIRED: 'bg-orange-100 text-orange-800 border-orange-200',
        ARCHIVED: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {status}
        </span>
    );
};
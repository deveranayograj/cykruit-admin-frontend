"use client";

import React from 'react';
import { Eye, Ban, RotateCcw } from 'lucide-react';
import { User } from '@/types/user';

interface TableActionsProps {
  user: User;
  onView: (id: string) => void;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
}

export const TableActions: React.FC<TableActionsProps> = ({
  user,
  onView,
  onSuspend,
  onActivate
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onView(user.id)}
        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
      {user.status === 'ACTIVE' && (
        <button
          onClick={() => onSuspend(user.id)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Suspend User"
        >
          <Ban className="w-4 h-4" />
        </button>
      )}
      {user.status === 'SUSPENDED' && (
        <button
          onClick={() => onActivate(user.id)}
          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
          title="Reactivate User"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
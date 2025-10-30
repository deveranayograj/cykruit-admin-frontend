"use client";

import React from 'react';
import { UserCheck } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <tr>
      <td colSpan={8} className="px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <UserCheck className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters or search query.</p>
        </div>
      </td>
    </tr>
  );
};
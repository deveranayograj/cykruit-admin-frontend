/* eslint-disable @typescript-eslint/no-unused-vars */
// Action Buttons
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { JobDetail } from '@/types/job';
export const ActionButtons: React.FC<{
  job: JobDetail;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ job, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Job Actions</h3>
      <div className="flex flex-col gap-3">
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-5 h-5" />
          Edit Job
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Delete Job
        </button>
      </div>
    </div>
  );
};
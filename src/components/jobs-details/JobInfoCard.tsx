/* eslint-disable @typescript-eslint/no-unused-vars */
// Job Info Card
import React from 'react';
import { JobDetail } from "@/types/job";
import { Building2, Briefcase, Clock, DollarSign, Link as LinkIcon, MapPin, Users } from 'lucide-react';
import { StatusBadge } from '@/components/jobs-details/StatusBadge';

export const JobInfoCard: React.FC<{ job: JobDetail }> = ({ job }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span>{job.employer.companyName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span>{job.role.name}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500 text-xs">Work Mode</div>
            <div className="font-medium">{job.workMode}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500 text-xs">Type</div>
            <div className="font-medium">{job.employmentType.replace('_', ' ')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500 text-xs">Experience</div>
            <div className="font-medium">{job.experience}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500 text-xs">Applications</div>
            <div className="font-medium">{job.applicationsCount}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-4">Job Description</h3>
        <div className="prose prose-sm max-w-none text-gray-700">
          {job.description}
        </div>
      </div>

      {job.applyType === 'EXTERNAL' && job.applyUrl && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <LinkIcon className="w-4 h-4" />
            <span className="font-medium">External Application Link:</span>
          </div>
          <a 
            href={job.applyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm break-all"
          >
            {job.applyUrl}
          </a>
        </div>
      )}
    </div>
  );
};
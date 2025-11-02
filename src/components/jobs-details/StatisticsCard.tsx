// Statistics Card
import React from 'react';
import { Eye, Users, Check, Calendar, Clock } from 'lucide-react';
import { JobDetail } from '@/types/job';
export const StatisticsCard: React.FC<{ job: JobDetail }> = ({ job }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Job Statistics</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Eye className="w-4 h-4" />
            <span>Total Views</span>
          </div>
          <span className="font-semibold">{job.views}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>Applications</span>
          </div>
          <span className="font-semibold">{job.applicationsCount}</span>
        </div>

        {job.shortlistedCount !== null && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-4 h-4" />
              <span>Shortlisted</span>
            </div>
            <span className="font-semibold">{job.shortlistedCount}</span>
          </div>
        )}

        {job.hiredCount !== null && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-4 h-4" />
              <span>Hired</span>
            </div>
            <span className="font-semibold">{job.hiredCount}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Posted Date</span>
          </div>
          <span className="text-sm">{formatDate(job.postedAt)}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Valid Until</span>
          </div>
          <span className="text-sm">{formatDate(job.validTill)}</span>
        </div>

        {job.closedAt && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Closed Date</span>
            </div>
            <span className="text-sm">{formatDate(job.closedAt)}</span>
          </div>
        )}

        {job.contractDurationInMonths && (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Contract Duration</span>
            </div>
            <span className="font-semibold">{job.contractDurationInMonths} months</span>
          </div>
        )}
      </div>
    </div>
  );
};
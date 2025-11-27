/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { JobDetail } from '@/types/job';
import {
  Building2,
  Briefcase,
  Clock,
  DollarSign,
  Link as LinkIcon,
  MapPin,
  Users,
  Eye,
  Calendar,
  UserCheck,
  Phone,
  Mail,
  ClipboardList,
  Award
} from 'lucide-react';
import { StatusBadge } from '@/components/jobs-details/StatusBadge';

export const JobInfoCard: React.FC<{ job: JobDetail }> = ({ job }) => {
  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const safe = (v: any, fallback = 'N/A') => (v === null || v === undefined || v === '' ? fallback : v);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{safe(job.title)}</h2>
          <div className="flex items-center gap-4 text-gray-600 mb-4 flex-wrap">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span>{job.employer?.companyName || '—'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span>{job.role?.name || '—'}</span>
            </div>
            {job.location?.city && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{`${job.location.city}${job.location.state ? ', ' + job.location.state : ''}${job.location.country ? ', ' + job.location.country : ''}`}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
            <div className="inline-flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{job.views ?? 0}</span>
              <span className="text-gray-400">views</span>
            </div>

            <div className="inline-flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{job.applicationsCount ?? 0}</span>
              <span className="text-gray-400">applications</span>
            </div>

            {job.shortlistedCount !== null && (
              <div className="inline-flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{job.shortlistedCount}</span>
                <span className="text-gray-400">shortlisted</span>
              </div>
            )}

            {job.hiredCount !== null && (
              <div className="inline-flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{job.hiredCount}</span>
                <span className="text-gray-400">hired</span>
              </div>
            )}
          </div>
        </div>

        <div className="ml-4 flex flex-col items-end gap-2">
          <StatusBadge status={job.status} />
          <div className="text-sm text-gray-500 font-mono">ID: {job.id}</div>
          {job.uniqueKey && <div className="text-xs text-gray-400">Key: {job.uniqueKey}</div>}
        </div>
      </div>

      {/* Quick properties grid */}
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
            <div className="text-gray-500 text-xs">Employment Type</div>
            <div className="font-medium">{String(job.employmentType).replace(/_/g, ' ')}</div>
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
          <ClipboardList className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500 text-xs">Apply Type</div>
            <div className="font-medium">{job.applyType}{job.applyType === 'EXTERNAL' && job.applyUrl ? ` — external` : ''}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-4">Job Description</h3>
        <div className="prose prose-sm max-w-none text-gray-700">{job.description}</div>
      </div>

      {/* Application / Links */}
      {(job.applyType === 'EXTERNAL' && job.applyUrl) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <LinkIcon className="w-4 h-4" />
            <span className="font-medium">External Application Link:</span>
          </div>
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm break-all">{job.applyUrl}</a>
        </div>
      )}

      {/* Approval & Reviewer summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <div className="text-sm text-gray-500">Approval</div>
          <div className="mt-2 text-sm text-gray-800 space-y-1">
            <div>Requires Approval: <span className="font-medium">{String(job.requiresApproval)}</span></div>
            <div>Auto Approved: <span className="font-medium">{String(job.autoApproved)}</span></div>
            <div>Resubmissions: <span className="font-medium">{job.resubmissionCount ?? 0}</span></div>
            {job.approvedAt && <div>Approved At: <span className="font-medium">{formatDateTime(job.approvedAt)}</span></div>}
            {job.approvedBy && <div>Approved By: <span className="font-medium">{job.approvedBy}</span></div>}
            {job.rejectedAt && <div className="text-red-600">Rejected At: <span className="font-medium">{formatDateTime(job.rejectedAt)}</span></div>}
            {job.rejectionReason && <div className="text-red-600">Reason: <span className="font-medium">{job.rejectionReason}</span></div>}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <div className="text-sm text-gray-500">Reviewer</div>
          <div className="mt-2 text-sm text-gray-800 space-y-1">
            {job.reviewer ? (
              <>
                <div className="font-medium">{job.reviewer.firstName} {job.reviewer.lastName}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500"> 
                  <Mail className="w-3 h-3" /> {job.reviewer.email}
                </div>
              </>
            ) : (
              <div className="text-gray-400">No reviewer assigned</div>
            )}
          </div>
        </div>
      </div>

      {/* Metadata and timestamps */}
      <div className="mt-6 border-t border-gray-100 pt-4 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <div className="text-xs text-gray-500">Posted</div>
          <div className="font-medium">{formatDateTime(job.postedAt)}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Published</div>
          <div className="font-medium">{formatDateTime(job.publishedAt ?? job.postedAt)}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Valid Till</div>
          <div className="font-medium">{formatDate(job.validTill)}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Created</div>
          <div className="font-medium">{formatDateTime(job.updatedAt)}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Updated</div>
          <div className="font-medium">{formatDateTime(job.updatedAt)}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Closed</div>
          <div className="font-medium">{job.closedAt ? formatDateTime(job.closedAt) : '—'}</div>
        </div>
      </div>

      {/* Helper: certifications, skills, screening questions (compact) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-100 rounded-lg">
          <div className="text-sm text-gray-500">Skills</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(job.skills || []).length === 0 ? (
              <div className="text-gray-400">No skills</div>
            ) : (
              (job.skills || []).map(s => (
                <span key={s.id} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">{s.name}</span>
              ))
            )}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-100 rounded-lg">
          <div className="text-sm text-gray-500">Certifications</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(job.certifications || []).length === 0 ? (
              <div className="text-gray-400">No certifications</div>
            ) : (
              (job.certifications || []).map(c => (
                <span key={c.id} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">{c.name}</span>
              ))
            )}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-100 rounded-lg">
          <div className="text-sm text-gray-500">Screening Questions</div>
          <div className="mt-2 text-xs text-gray-700 space-y-2">
            {(job.screeningQuestions || []).length === 0 ? (
              <div className="text-gray-400">No screening questions</div>
            ) : (
              (job.screeningQuestions || []).slice(0,3).map(q => (
                <div key={q.id} className="truncate">
                  • {q.question} {q.required ? <span className="text-red-500">*</span> : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

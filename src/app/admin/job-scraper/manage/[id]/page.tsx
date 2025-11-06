/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, Building2, MapPin, Briefcase, Clock, 
  Users, Eye, Calendar, Edit, Trash2, Database, Link as LinkIcon,
  Award, Code
} from 'lucide-react';
import { scrapedJobService } from "@/services/scrapedJobService";
import { useApi } from "@/hooks/useApi";
import { ScrapedJobDetail } from "@/types/scraped-job";

// Breadcrumb Component
const Breadcrumb: React.FC<{ jobTitle?: string }> = ({ jobTitle }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-gray-900">Home</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/admin/dashboard" className="hover:text-gray-900">Admin Dashboard</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/admin/job-scraper/manage" className="hover:text-gray-900">Scraped Jobs</Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">{jobTitle || 'Job Details'}</span>
    </nav>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    EXPIRED: 'bg-orange-100 text-orange-800 border-orange-200',
    ARCHIVED: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

// Source Badge
const SourceBadge: React.FC<{ source: string }> = ({ source }) => {
  const styles: Record<string, string> = {
    indeed: 'bg-blue-100 text-blue-800 border-blue-200',
    linkedin: 'bg-blue-100 text-blue-800 border-blue-200',
    glassdoor: 'bg-green-100 text-green-800 border-green-200',
    ai: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const displayName = source.charAt(0).toUpperCase() + source.slice(1);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[source.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
      <Database className="w-4 h-4 mr-1" />
      {displayName}
    </span>
  );
};

// Job Info Card
const JobInfoCard: React.FC<{ job: ScrapedJobDetail }> = ({ job }) => {
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
              <span>{job.company.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span>{job.role.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />
          <SourceBadge source={job.source} />
        </div>
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
          <Users className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500 text-xs">Experience</div>
            <div className="font-medium">{job.experience}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Database className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500 text-xs">External ID</div>
            <div className="font-medium text-xs">{job.externalJobId || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-4">Job Description</h3>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
          {job.description}
        </div>
      </div>

      {job.applyUrl && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <LinkIcon className="w-4 h-4" />
            <span className="font-medium">Application Link:</span>
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

      {job.originalUrl && job.originalUrl !== job.applyUrl && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <LinkIcon className="w-4 h-4" />
            <span className="font-medium">Original Source URL:</span>
          </div>
          <a 
            href={job.originalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 text-sm break-all"
          >
            {job.originalUrl}
          </a>
        </div>
      )}
    </div>
  );
};

// Company Info Card
const CompanyInfoCard: React.FC<{ job: ScrapedJobDetail }> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Company Information</h3>
      
      <div className="space-y-4">
        {job.company.logo && (
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <img 
              src={job.company.logo} 
              alt={job.company.name}
              className="max-h-20 object-contain"
            />
          </div>
        )}

        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-500">Company Name</div>
            <div className="font-medium text-gray-900">{job.company.name}</div>
          </div>

          {job.company.website && (
            <div>
              <div className="text-sm text-gray-500">Website</div>
              <a 
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {job.company.website}
              </a>
            </div>
          )}

          {job.company.size && (
            <div>
              <div className="text-sm text-gray-500">Company Size</div>
              <div className="font-medium text-gray-900">{job.company.size}</div>
            </div>
          )}

          {job.company.industry && (
            <div>
              <div className="text-sm text-gray-500">Industry</div>
              <div className="font-medium text-gray-900">{job.company.industry}</div>
            </div>
          )}

          {job.company.about && (
            <div>
              <div className="text-sm text-gray-500 mb-1">About</div>
              <div className="text-sm text-gray-700">{job.company.about}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Location & Role Card
const LocationRoleCard: React.FC<{ job: ScrapedJobDetail }> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Location & Role</h3>
      
      <div className="space-y-4">
        {job.location && (
          <div>
            <div className="text-sm text-gray-500 mb-2">Location</div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="text-gray-900">
                {job.location.city && <div>{job.location.city}</div>}
                {job.location.state && <div>{job.location.state}</div>}
                {job.location.country && <div>{job.location.country}</div>}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4">
          <div className="text-sm text-gray-500 mb-2">Role</div>
          <div className="font-medium text-gray-900">{job.role.name}</div>
          {job.role.category && (
            <div className="text-sm text-gray-600 mt-1">
              Category: {job.role.category.title}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Skills & Certifications Card
const SkillsCertificationsCard: React.FC<{ job: ScrapedJobDetail }> = ({ job }) => {
  if (!job.skills?.length && !job.certifications?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Skills & Certifications</h3>
      
      <div className="space-y-4">
        {job.skills && job.skills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Code className="w-4 h-4" />
              <span>Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span 
                  key={skill.id}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.certifications && job.certifications.length > 0 && (
          <div className={job.skills?.length ? 'border-t border-gray-100 pt-4' : ''}>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Award className="w-4 h-4" />
              <span>Certifications</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.certifications.map((cert) => (
                <span 
                  key={cert.id}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                >
                  {cert.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Metadata Card
const MetadataCard: React.FC<{ job: ScrapedJobDetail }> = ({ job }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Job Metadata</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Scraped At</span>
          </div>
          <span className="text-sm">{formatDate(job.scrapedAt)}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Posted At</span>
          </div>
          <span className="text-sm">{formatDate(job.postedAt)}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Valid Till</span>
          </div>
          <span className="text-sm">{formatDate(job.validTill)}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Database className="w-4 h-4" />
            <span>Source</span>
          </div>
          <SourceBadge source={job.source} />
        </div>

        {job.externalJobId && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Database className="w-4 h-4" />
              <span>External Job ID</span>
            </div>
            <span className="text-sm font-mono text-gray-900">{job.externalJobId}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Eye className="w-4 h-4" />
            <span>Status</span>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </div>
    </div>
  );
};

// Action Buttons
const ActionButtons: React.FC<{
  jobId: string;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ jobId, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Actions</h3>
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

// Main Component
const ScrapedJobDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  
  const [jobData, setJobData] = useState<ScrapedJobDetail | null>(null);

  const { loading, error, execute } = useApi({
    onSuccess: (response: ScrapedJobDetail) => {
      setJobData(response);
    }
  });

  useEffect(() => {
    if (id) {
      execute(() => scrapedJobService.getScrapedJobDetail(id));
    }
  }, [id]);

  const handleEdit = () => {
    window.location.href = `/admin/job-scraper/manage/${id}`;
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this scraped job? This action cannot be undone.')) {
      try {
        await scrapedJobService.deleteScrapedJob(id);
        alert('Scraped Job Deleted!');
        window.location.href = '/admin/job-scraper/manage';
      } catch (error: any) {
        alert(`Failed to delete: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium mb-2">Failed to load job details</p>
          <p className="text-red-600 text-sm mb-4">{error?.message || 'Job not found'}</p>
          <button
            onClick={() => window.location.href = '/admin/job-scraper/manage'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Scraped Jobs List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb jobTitle={jobData.title} />

      <div className="mb-6">
        <Link 
          href="/admin/job-scraper/manage"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Scraped Jobs List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <JobInfoCard job={jobData} />
          <SkillsCertificationsCard job={jobData} />
        </div>
        
        <div className="space-y-6">
          <CompanyInfoCard job={jobData} />
          <LocationRoleCard job={jobData} />
          <MetadataCard job={jobData} />
          <ActionButtons 
            jobId={jobData.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrapedJobDetailPage;
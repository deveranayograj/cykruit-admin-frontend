/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Save, X, Loader2 } from 'lucide-react';
import { jobService } from "@/services/jobService";
import { useApi } from "@/hooks/useApi";
import { JobDetail, JobUpdateRequest } from "@/types/job";

// Breadcrumb Component
const Breadcrumb: React.FC<{ jobTitle?: string }> = ({ jobTitle }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-gray-900">Home</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/admin/dashboard" className="hover:text-gray-900">Admin Dashboard</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/admin/jobs" className="hover:text-gray-900">Jobs</Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Edit: {jobTitle || 'Job'}</span>
    </nav>
  );
};

// Main Component
const JobEditPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  
  const [jobData, setJobData] = useState<JobDetail | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<JobUpdateRequest>({
    title: '',
    description: '',
    workMode: 'ONSITE',
    employmentType: 'FULL_TIME',
    experience: 'MID',
    status: 'DRAFT',
    contractDurationInMonths: undefined,
    applyType: 'DIRECT',
    applyUrl: '',
    validTill: '',
    roleId: '',
    locationId: '',
  });

  const { loading, error, execute } = useApi({
    onSuccess: (response: JobDetail) => {
      setJobData(response);
      
      // Populate form with existing data
      setFormData({
        title: response.title,
        description: response.description,
        workMode: response.workMode,
        employmentType: response.employmentType,
        experience: response.experience,
        status: response.status,
        contractDurationInMonths: response.contractDurationInMonths || undefined,
        applyType: response.applyType,
        applyUrl: response.applyUrl || '',
        validTill: response.validTill ? new Date(response.validTill).toISOString().split('T')[0] : '',
        roleId: response.roleId,
        locationId: response.locationId || '',
      });
    }
  });

  useEffect(() => {
    if (id) {
      execute(() => jobService.getJobDetail(id));
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseInt(value) : undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean up data before sending
      const updateData: JobUpdateRequest = {
        ...formData,
        applyUrl: formData.applyType === 'EXTERNAL' ? formData.applyUrl : undefined,
        contractDurationInMonths: formData.employmentType === 'CONTRACT' ? formData.contractDurationInMonths : undefined,
      };

      await jobService.updateJob(id, updateData);
      alert('Job updated successfully!');
      window.location.href = `/admin/jobs/${id}`;
    } catch (error: any) {
      alert(`Failed to update job: ${error.message}`);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      window.location.href = `/admin/jobs/${id}`;
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
            onClick={() => window.location.href = '/admin/jobs'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Jobs List
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
          href={`/admin/jobs/${id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Job Details
        </Link>
      </div>

      <div className="max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Job</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Job Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the job responsibilities, requirements, and qualifications..."
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Job Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Work Mode */}
              <div>
                <label htmlFor="workMode" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Mode <span className="text-red-500">*</span>
                </label>
                <select
                  id="workMode"
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="REMOTE">Remote</option>
                  <option value="ONSITE">Onsite</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              {/* Employment Type */}
              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ENTRY">Entry Level</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior Level</option>
                  <option value="LEAD">Lead</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Contract Duration (only for CONTRACT type) */}
              {formData.employmentType === 'CONTRACT' && (
                <div>
                  <label htmlFor="contractDurationInMonths" className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Duration (Months)
                  </label>
                  <input
                    type="number"
                    id="contractDurationInMonths"
                    name="contractDurationInMonths"
                    value={formData.contractDurationInMonths || ''}
                    onChange={handleNumberChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 6"
                  />
                </div>
              )}

              {/* Valid Till */}
              <div>
                <label htmlFor="validTill" className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Till
                </label>
                <input
                  type="date"
                  id="validTill"
                  name="validTill"
                  value={formData.validTill}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Application Details</h2>
            
            <div className="space-y-4">
              {/* Apply Type */}
              <div>
                <label htmlFor="applyType" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="applyType"
                  name="applyType"
                  value={formData.applyType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DIRECT">Direct Application</option>
                  <option value="EXTERNAL">External Link</option>
                </select>
              </div>

              {/* External URL (only for EXTERNAL type) */}
              {formData.applyType === 'EXTERNAL' && (
                <div>
                  <label htmlFor="applyUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    External Application URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="applyUrl"
                    name="applyUrl"
                    value={formData.applyUrl}
                    onChange={handleInputChange}
                    required={formData.applyType === 'EXTERNAL'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/apply"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Read-only Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Company:</span>
                <span className="ml-2 font-medium text-gray-900">{jobData.employer.companyName}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Role:</span>
                <span className="ml-2 font-medium text-gray-900">{jobData.role.name}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Applications:</span>
                <span className="ml-2 font-medium text-gray-900">{jobData.applicationsCount}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Views:</span>
                <span className="ml-2 font-medium text-gray-900">{jobData.views}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default JobEditPage;
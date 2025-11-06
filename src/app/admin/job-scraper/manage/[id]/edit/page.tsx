/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Save, X, Loader2 } from 'lucide-react';
import { scrapedJobService } from "@/services/scrapedJobService";
import { useApi } from "@/hooks/useApi";
import { ScrapedJobDetail, UpdateScrapedJobDto } from "@/types/scraped-job";

// Breadcrumb Component
const Breadcrumb: React.FC<{ jobTitle?: string }> = ({ jobTitle }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-gray-900">Home</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/admin/dashboard" className="hover:text-gray-900">Admin Dashboard</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/admin/job-scraper/manage" className="hover:text-gray-900">Scraped Jobs Management</Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Edit: {jobTitle || 'Job'}</span>
    </nav>
  );
};

// Main Component
const ScrapedJobEditPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  
  const [jobData, setJobData] = useState<ScrapedJobDetail | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<UpdateScrapedJobDto>({
    title: '',
    description: '',
    roleName: '',
    categoryName: '',
    workMode: 'ONSITE',
    employmentType: 'FULL_TIME',
    experience: 'MID',
    companyName: '',
    companyLogo: '',
    companyWebsite: '',
    companySize: '',
    companyIndustry: '',
    companyAbout: '',
    location: {
      city: '',
      state: '',
      country: '',
    },
    applyUrl: '',
    skills: [],
    certifications: [],
    source: '',
    externalJobId: '',
    originalUrl: '',
    validTill: '',
  });

  const { loading, error, execute } = useApi({
    onSuccess: (response: ScrapedJobDetail) => {
      setJobData(response);
      
      // Populate form with existing data
      setFormData({
        title: response.title,
        description: response.description,
        roleName: response.role.name,
        categoryName: response.role.category?.title || '',
        workMode: response.workMode,
        employmentType: response.employmentType,
        experience: response.experience,
        companyName: response.company.name,
        companyLogo: response.company.logo || '',
        companyWebsite: response.company.website || '',
        companySize: response.company.size || '',
        companyIndustry: response.company.industry || '',
        companyAbout: response.company.about || '',
        location: response.location ? {
          city: response.location.city,
          state: response.location.state,
          country: response.location.country,
        } : undefined,
        applyUrl: response.applyUrl || '',
        skills: response.skills.map(s => s.name),
        certifications: response.certifications.map(c => c.name),
        source: response.source,
        externalJobId: response.externalJobId || '',
        originalUrl: response.originalUrl || '',
        validTill: response.validTill ? new Date(response.validTill).toISOString().split('T')[0] : '',
      });
    }
  });

  useEffect(() => {
    if (id) {
      execute(() => scrapedJobService.getScrapedJobDetail(id));
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleArrayChange = (field: 'skills' | 'certifications', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await scrapedJobService.updateScrapedJob(id, formData);
      alert('Scraped job updated successfully!');
      window.location.href = `/admin/job-scraper/manage`;
    } catch (error: any) {
      alert(`Failed to update job: ${error.message}`);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      window.location.href = `/admin/job-scraper/manage`;
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

      <div className="max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Scraped Job</h1>

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
                  placeholder="e.g., Senior Cybersecurity Analyst"
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
              {/* Role Name */}
              <div>
                <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="roleName"
                  name="roleName"
                  value={formData.roleName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Security Analyst"
                />
              </div>

              {/* Category Name */}
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Cyber Security"
                />
              </div>

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

          {/* Company Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  id="companyWebsite"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <input
                  type="text"
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1000-5000"
                />
              </div>

              <div>
                <label htmlFor="companyIndustry" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Industry
                </label>
                <input
                  type="text"
                  id="companyIndustry"
                  name="companyIndustry"
                  value={formData.companyIndustry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Technology"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="companyAbout" className="block text-sm font-medium text-gray-700 mb-1">
                  Company About
                </label>
                <textarea
                  id="companyAbout"
                  name="companyAbout"
                  value={formData.companyAbout}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description about the company..."
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.location?.city || ''}
                  onChange={handleLocationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.location?.state || ''}
                  onChange={handleLocationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.location?.country || ''}
                  onChange={handleLocationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Skills & Certifications */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Skills & Certifications</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills?.join(', ')}
                  onChange={(e) => handleArrayChange('skills', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Python, AWS, Docker"
                />
              </div>

              <div>
                <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  id="certifications"
                  name="certifications"
                  value={formData.certifications?.join(', ')}
                  onChange={(e) => handleArrayChange('certifications', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., CISSP, CEH, Security+"
                />
              </div>
            </div>
          </div>

          {/* Application & Source Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Application & Source Info</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="applyUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Apply URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="applyUrl"
                  name="applyUrl"
                  value={formData.applyUrl}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/apply"
                />
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                  Source <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., indeed, linkedin"
                />
              </div>

              <div>
                <label htmlFor="externalJobId" className="block text-sm font-medium text-gray-700 mb-1">
                  External Job ID
                </label>
                <input
                  type="text"
                  id="externalJobId"
                  name="externalJobId"
                  value={formData.externalJobId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Original URL
                </label>
                <input
                  type="url"
                  id="originalUrl"
                  name="originalUrl"
                  value={formData.originalUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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

export default ScrapedJobEditPage;
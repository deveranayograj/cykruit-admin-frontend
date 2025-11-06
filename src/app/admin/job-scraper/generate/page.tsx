/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, Database, Loader2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { scrapedJobService } from "@/services/scrapedJobService";
import { GeneratedJob, CreateScrapedJobDto } from "@/types/scraped-job";

// Breadcrumb Component
const Breadcrumb: React.FC = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-gray-900">Home</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/admin/dashboard" className="hover:text-gray-900">Admin Dashboard</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/admin/job-scraper/manage" className="hover:text-gray-900">Scraped Jobs</Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Generate Jobs</span>
    </nav>
  );
};

// Generated Job Row Component
const GeneratedJobRow: React.FC<{
  job: GeneratedJob;
  index: number;
  onInsert: (job: GeneratedJob) => void;
  isInserting: boolean;
  insertStatus: 'idle' | 'success' | 'error';
}> = ({ job, index, onInsert, isInserting, insertStatus }) => {
  const handelLinkClick = () => {
    window.open(job.originalUrl, '_blank');
  };
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm text-gray-900">
        {index + 1}
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-gray-900"><button
            onClick={() => handelLinkClick()}
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer text-left"
          >
            {job.title}
          </button></div>
          <div className="text-xs text-gray-500 mt-1">{job.roleName}</div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {job.companyName}
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
          {job.workMode}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {job.employmentType.replace('_', ' ')}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {job.experience}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {job.location ? `${job.location.city || ''}, ${job.location.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'Remote' : 'Remote'}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {insertStatus === 'success' ? (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              Inserted
            </span>
          ) : insertStatus === 'error' ? (
            <span className="flex items-center gap-1 text-red-600 text-sm">
              <XCircle className="w-4 h-4" />
              Failed
            </span>
          ) : (
            <button
              onClick={() => onInsert(job)}
              disabled={isInserting}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isInserting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Inserting...
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  Insert
                </>
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

// Main Component
const GenerateJobsPage: React.FC = () => {
  // Form state
  const [source, setSource] = useState('ai');
  const [category, setCategory] = useState('Cyber Security');
  const [count, setCount] = useState(5);

  // Generated jobs state
  const [generatedJobs, setGeneratedJobs] = useState<GeneratedJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Insert state
  const [insertingJobIds, setInsertingJobIds] = useState<Set<string>>(new Set());
  const [insertedJobIds, setInsertedJobIds] = useState<Set<string>>(new Set());
  const [failedJobIds, setFailedJobIds] = useState<Set<string>>(new Set());
  const [isBulkInserting, setIsBulkInserting] = useState(false);

  // Handle Generate
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedJobs([]);
    setInsertedJobIds(new Set());
    setFailedJobIds(new Set());

    try {
      const response = await scrapedJobService.generateJobs({
        source,
        category,
        count,
      });

      // Add temporary IDs for tracking
      const jobsWithIds = response.jobs.map((job, index) => ({
        ...job,
        _tempId: `temp-${Date.now()}-${index}`,
      }));

      setGeneratedJobs(jobsWithIds);
    } catch (error: any) {
      setGenerateError(error.message || 'Failed to generate jobs');
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert GeneratedJob to CreateScrapedJobDto format
  const convertToCreateDto = (job: GeneratedJob): CreateScrapedJobDto => {
    // Map "OFFICE" to "ONSITE" for backend compatibility
    const workMode = job.workMode === 'OFFICE' ? 'ONSITE' : job.workMode;

    return {
      title: job.title,
      description: job.description,
      roleName: job.roleName,
      categoryName: job.categoryName,
      workMode: workMode as 'REMOTE' | 'ONSITE' | 'HYBRID',
      employmentType: job.employmentType as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP',
      experience: job.experience as 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD',
      companyName: job.companyName,
      companyLogo: job.companyLogo || undefined,
      companyWebsite: job.companyWebsite || undefined,
      companyIndustry: job.companyIndustry,
      location: {
        city: job.location.city,
        state: job.location.state,
        country: job.location.country,
      },
      applyUrl: job.applyUrl,
      skills: job.skills,
      source: job.source,
      externalJobId: job.externalJobId,
      originalUrl: job.originalUrl,
    };
  };

  // Handle Single Insert
  const handleInsertSingle = async (job: GeneratedJob) => {
    const tempId = job._tempId!;
    setInsertingJobIds(prev => new Set(prev).add(tempId));

    try {
      const jobDto = convertToCreateDto(job);
      const result = await scrapedJobService.createScrapedJob(jobDto);

      if (result.success) {
        setInsertedJobIds(prev => new Set(prev).add(tempId));
        alert(`Job "${job.title}" inserted successfully!`);
      } else {
        setFailedJobIds(prev => new Set(prev).add(tempId));
        alert(result.message || 'Failed to insert job');
      }
    } catch (error: any) {
      setFailedJobIds(prev => new Set(prev).add(tempId));
      alert(`Failed to insert: ${error.message}`);
    } finally {
      setInsertingJobIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
    }
  };

  // Handle Bulk Insert All
  const handleInsertAll = async () => {
    if (!confirm(`Are you sure you want to insert all ${generatedJobs.length} jobs?`)) {
      return;
    }

    setIsBulkInserting(true);

    try {
      // Convert all jobs to CreateScrapedJobDto format
      const jobDtos = generatedJobs.map(job => convertToCreateDto(job));

      const result = await scrapedJobService.bulkCreateScrapedJobs({
        jobs: jobDtos,
      });

      alert(
        `Bulk insert completed!\nTotal: ${result.total}\nSuccessful: ${result.successful}\nFailed: ${result.failed}`
      );

      // Mark all as inserted (or failed based on result)
      const successIds = new Set<string>();
      const failIds = new Set<string>();

      result.results.forEach((res, index) => {
        const tempId = generatedJobs[index]._tempId!;
        if (res.success) {
          successIds.add(tempId);
        } else {
          failIds.add(tempId);
        }
      });

      setInsertedJobIds(successIds);
      setFailedJobIds(failIds);
    } catch (error: any) {
      alert(`Bulk insert failed: ${error.message}`);
    } finally {
      setIsBulkInserting(false);
    }
  };

  const getInsertStatus = (tempId: string): 'idle' | 'success' | 'error' => {
    if (insertedJobIds.has(tempId)) return 'success';
    if (failedJobIds.has(tempId)) return 'error';
    return 'idle';
  };

  return (
    <div className="p-6">
      <Breadcrumb />

      <div className="mb-6">
        <Link
          href="/admin/job-scraper/manage"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Scraped Jobs List
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Generate Scraped Jobs</h1>

      {/* Generation Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Generation Parameters</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Source */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="naukri">Naukri</option>
              <option value="indeed">Indeed</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Cyber Security">Cyber Security</option>
              <option value="AI Governance">AI Governance</option>
              <option value="Data Privacy">Data Privacy</option>
            </select>
          </div>

          {/* Count */}
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
              Count (1-10)
            </label>
            <input
              type="number"
              id="count"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Jobs...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Jobs
            </>
          )}
        </button>

        {generateError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-medium">Error:</p>
            <p className="text-sm">{generateError}</p>
          </div>
        )}
      </div>

      {/* Generated Jobs Table */}
      {generatedJobs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Generated Jobs ({generatedJobs.length})
            </h2>
            <button
              onClick={handleInsertAll}
              disabled={isBulkInserting || insertedJobIds.size === generatedJobs.length}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBulkInserting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Inserting All...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Insert All into DB
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {generatedJobs.map((job, index) => (
                  <GeneratedJobRow
                    key={job._tempId}
                    job={job}
                    index={index}
                    onInsert={handleInsertSingle}
                    isInserting={insertingJobIds.has(job._tempId!)}
                    insertStatus={getInsertStatus(job._tempId!)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <span className="text-gray-600">
                  Total: <span className="font-medium text-gray-900">{generatedJobs.length}</span>
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Inserted: <span className="font-medium">{insertedJobIds.size}</span>
                </span>
                {failedJobIds.size > 0 && (
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle className="w-4 h-4" />
                    Failed: <span className="font-medium">{failedJobIds.size}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateJobsPage;
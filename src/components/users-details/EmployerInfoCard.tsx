/* eslint-disable @next/next/no-img-element */
"use client";

import React from 'react';
import { Building2, Globe, Briefcase, Users, CheckCircle, XCircle } from 'lucide-react';
import { UserDetail } from '@/types/user';

export const EmployerInfoCard: React.FC<{ user: UserDetail }> = ({ user }) => {
  if (!user.employer) return null;

  const { employer } = user;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>
      
      <div className="space-y-4">
        {employer.companyLogo && (
          <div className="mb-4">
            <img 
              src={employer.companyLogo} 
              alt={employer.companyName}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Company Name</p>
            <p className="font-medium text-gray-900">{employer.companyName}</p>
            <p className="text-xs text-gray-500 mt-1">Slug: {employer.slug}</p>
          </div>
        </div>

        {employer.companyWebsite && (
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Website</p>
              <a 
                href={employer.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                {employer.companyWebsite}
              </a>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium text-gray-900">{employer.industry}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Company Type</p>
            <p className="font-medium text-gray-900">{employer.companyType}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Company Size</p>
            <p className="font-medium text-gray-900">{employer.companySize.replace('SIZE_', '').replace('_', '-')}</p>
          </div>
        </div>

        {employer.foundedYear && (
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Founded Year</p>
              <p className="font-medium text-gray-900">{employer.foundedYear}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Verification Status</p>
            <div className="flex items-center gap-2 mt-1">
              {employer.isVerified ? (
                <span className="inline-flex items-center gap-1 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                  <XCircle className="w-4 h-4" />
                  Not Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Onboarding Step</p>
            <p className="font-medium text-gray-900">{employer.onboardingStep.replace(/_/g, ' ')}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">About</p>
              <p className="text-sm text-gray-700 mt-1">{employer.about}</p>
            </div>
          </div>
        </div>

        {user.stats && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Statistics</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-blue-700">{user.stats.totalJobs}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-green-700">{user.stats.totalApplicants}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
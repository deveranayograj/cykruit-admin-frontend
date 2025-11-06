/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { JobDetail } from "@/types/job";
import { Building2 } from "lucide-react";

export const EmployerInfoCard: React.FC<{ job: JobDetail }> = ({ job }) => {
  const employer = job.employer;

  if (!employer) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-gray-600" />
        Employer Information
      </h3>

      <div className="space-y-3">
        {employer.companyLogo && (
          <div className="flex justify-center mb-4">
            <img
              src={employer.companyLogo}
              alt={employer.companyName}
              className="max-h-20 object-contain"
            />
          </div>
        )}

        <div>
          <div className="text-sm text-gray-500">Company Name</div>
          <div className="font-medium text-gray-900">{employer.companyName}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Employer ID</div>
          <div className="font-mono text-gray-800 text-sm">{employer.id}</div>
        </div>
      </div>
    </div>
  );
};

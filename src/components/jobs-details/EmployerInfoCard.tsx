/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { JobDetail } from "@/types/job";
import { Building2, Phone, Mail, Info } from "lucide-react";

export const EmployerInfoCard: React.FC<{ job: JobDetail }> = ({ job }) => {
  const employer = job.employer;
  if (!employer) return null;

  const safe = (v: any, fallback = "—") =>
    v === null || v === undefined || v === "" ? fallback : v;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-gray-600" />
        Employer Information
      </h3>

      <div className="space-y-4">
        {/* Logo */}
        {employer.companyLogo && (
          <div className="flex justify-center mb-4">
            <img
              src={employer.companyLogo}
              alt={safe(employer.companyName)}
              className="max-h-20 object-contain"
            />
          </div>
        )}

        {/* Company Name */}
        <div>
          <div className="text-sm text-gray-500">Company Name</div>
          <div className="font-medium text-gray-900">{safe(employer.companyName)}</div>
        </div>

        {/* Employer ID */}
        <div>
          <div className="text-sm text-gray-500">Employer ID</div>
          <div className="font-mono text-gray-800 text-sm">{safe(employer.id)}</div>
        </div>

        {/* User ID */}
        {employer.userId && (
          <div>
            <div className="text-sm text-gray-500">User ID</div>
            <div className="font-mono text-gray-800 text-sm">{employer.userId}</div>
          </div>
        )}

        {/* Email */}
        {employer.user?.email && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{employer.user?.email}</span>
          </div>
        )}

        {/* Phone */}
        {employer.user?.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{employer.user?.phone}</span>
          </div>
        )}

        {/* Additional Info */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Info className="w-4 h-4" />
            More Details
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Created By: {safe(job.createdBy)}</p>
            <p>Updated By: {safe(job.updatedBy)}</p>
            <p>Deleted At: {safe(job.deletedAt, "Not deleted")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
"use client";
import React from "react";
import { JobDetail } from "@/types/job";
import { MapPin, Briefcase, Layers } from "lucide-react";

export const LocationRoleCard: React.FC<{ job: JobDetail }> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Location & Role</h3>
      
      <div className="space-y-4">
        {job.locationId && (
          <div>
            <div className="text-sm text-gray-500 mb-1">Location ID</div>
            <div className="flex items-center gap-2 text-gray-800">
              <MapPin className="w-4 h-4 text-gray-400" />
              {job.locationId}
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4">
          <div className="text-sm text-gray-500 mb-1">Role</div>
          <div className="flex items-center gap-2 text-gray-800">
            <Briefcase className="w-4 h-4 text-gray-400" />
            {job.role.name}
          </div>
        </div>

        {job.JobCategory && (
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm text-gray-500 mb-1">Job Category</div>
            <div className="flex items-center gap-2 text-gray-800">
              <Layers className="w-4 h-4 text-gray-400" />
              {job.JobCategory.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

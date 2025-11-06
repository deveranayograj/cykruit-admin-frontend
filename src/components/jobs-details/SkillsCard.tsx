/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { JobDetail } from "@/types/job";
import { Code } from "lucide-react";

export const SkillsCard: React.FC<{ job: JobDetail }> = ({ job }) => {
  const skills = (job as any).skills || []; // Add skills array in backend response if available
  if (!skills || skills.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-gray-600" />
        Skills
      </h3>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill: any, idx: number) => (
          <span
            key={skill.id || idx}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
};

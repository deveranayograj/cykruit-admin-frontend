import React from 'react';
import { Employer } from '@/types/dashboard';

interface TopEmployersProps {
  employers: Employer[];
}

export function TopEmployers({ employers }: TopEmployersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Employers</h3>
      <div className="space-y-4">
        {employers.map((employer, idx) => {
          const totalApplications = employer.jobs.reduce(
            (sum, job) => sum + job._count.applications, 
            0
          );
          
          return (
            <div key={employer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{employer.companyName}</p>
                  <p className="text-sm text-gray-500">{employer._count.jobs} jobs posted</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{totalApplications}</p>
                <p className="text-xs text-gray-500">applications</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
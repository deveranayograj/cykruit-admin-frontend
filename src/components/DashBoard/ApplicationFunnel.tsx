import React from 'react';
import { ApplicationFunnelStage } from '@/types/dashboard';

interface ApplicationFunnelProps {
  stages: ApplicationFunnelStage[];
  total: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ApplicationFunnel({ stages, total }: ApplicationFunnelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Funnel</h3>
      <div className="space-y-3">
        {stages.map((stage, idx) => (
          <div key={stage.name} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{stage.name}</span>
              <span className="text-sm text-gray-600">
                {stage.count} {stage.percentage && `(${stage.percentage}%)`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all"
                style={{ 
                  width: `${stage.percentage || (stage.count / total * 100)}%`,
                  backgroundColor: COLORS[idx % COLORS.length]
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
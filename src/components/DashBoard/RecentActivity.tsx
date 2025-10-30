import React from 'react';
import { Activity } from '@/types/dashboard';

interface RecentActivityProps {
  activities: Activity[];
  hasMore: boolean;
  onViewAll: () => void;
}

export function RecentActivity({ activities, hasMore, onViewAll }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">
                  {activity.admin.firstName} {activity.admin.lastName}
                </span>
                {' '}performed{' '}
                <span className="font-medium text-blue-600">{activity.action}</span>
                {' '}on {activity.resource}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button 
          onClick={onViewAll}
          className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View All Activity
        </button>
      )}
    </div>
  );
}
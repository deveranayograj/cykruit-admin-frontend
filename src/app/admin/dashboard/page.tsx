/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, Building2 } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import {
  StatsOverview,
  ChartData,
  ApplicationFunnelStage,
  Employer,
  RecentActivityData,
  AnalyticsQueryParams
} from '@/types/dashboard';
import { Breadcrumb } from '@/components/DashBoard/Breadcrumb';
import { StatCard } from '@/components/DashBoard/StatCard';
import { PendingReviewsAlert } from '@/components/DashBoard/PendingReviewsAlert';
import { UserGrowthChart } from '@/components/DashBoard/UserGrowthChart';
import { JobStatisticsChart } from '@/components/DashBoard/JobStatisticsChart';
import { ApplicationFunnel } from '@/components/DashBoard/ApplicationFunnel';
import { TopEmployers } from '@/components/DashBoard/TopEmployers';
import { RecentActivity } from '@/components/DashBoard/RecentActivity';
import { LoadingSpinner } from '@/components/DashBoard/LoadingSpinner';
import { ErrorDisplay } from '@/components/DashBoard/ErrorDisplay';

export default function Dashboard() {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivityData | null>(null);
  const [userGrowthData, setUserGrowthData] = useState<ChartData | null>(null);
  const [jobStatsData, setJobStatsData] = useState<ChartData | null>(null);
  const [applicationFunnel, setApplicationFunnel] = useState<{ stages: ApplicationFunnelStage[]; total: number } | null>(null);
  const [topEmployers, setTopEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Narrow the type so `groupBy` matches the allowed union in AnalyticsQueryParams
  const [dateRange] = useState<AnalyticsQueryParams>({ groupBy: 'day' });

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        statsResp,
        activityResp,
        userGrowthResp,
        jobStatsResp,
        appFunnelResp,
        employersResp,
      ] = await Promise.all([
        dashboardService.getStatsOverview(),
        // pass an object per service signature
        dashboardService.getRecentActivity({ limit: 10, offset: 0 }),
        // dateRange is already typed as AnalyticsQueryParams
        dashboardService.getUserGrowth(dateRange),
        dashboardService.getJobStatistics(dateRange),
        dashboardService.getApplicationFunnel(dateRange),
        // getTopEmployers expects a params object
        dashboardService.getTopEmployers(10, dateRange),
      ]);

      // these services return ApiResponse<T> objects; extract `.data`
      setStats(statsResp.data);
      setRecentActivity(activityResp.data);
      setUserGrowthData(userGrowthResp.data);
      setJobStatsData(jobStatsResp.data);
      setApplicationFunnel(appFunnelResp.data);
      setTopEmployers(employersResp.data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={loadDashboardData} />;
  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.users.total}
            growth={stats.users.growth}
            icon={Users}
            color="bg-blue-500"
            subtitle={`${stats.users.seekers} seekers, ${stats.users.employers} employers`}
          />
          <StatCard
            title="Active Jobs"
            value={stats.jobs.active}
            growth={stats.jobs.growth}
            icon={Briefcase}
            color="bg-green-500"
            subtitle={`${stats.jobs.draft} drafts, ${stats.jobs.expired} expired`}
          />
          <StatCard
            title="Applications"
            value={stats.applications.total}
            icon={FileText}
            color="bg-purple-500"
            subtitle={`${stats.applications.hired} hired`}
          />
          <StatCard
            title="Verified Employers"
            value={stats.employers.verified}
            growth={stats.employers.growth}
            icon={Building2}
            color="bg-orange-500"
            subtitle={`${stats.employers.pending} pending`}
          />
        </div>

        {/* Pending Reviews Alert */}
        <PendingReviewsAlert
          kycCount={stats.pendingReviews.kyc}
          reportsCount={stats.pendingReviews.reports}
          onReviewClick={() => console.log('Navigate to reviews')}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {userGrowthData && <UserGrowthChart data={userGrowthData} />}
          {jobStatsData && <JobStatisticsChart data={jobStatsData} />}
        </div>

        {/* Application Funnel & Top Employers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {applicationFunnel && (
            <ApplicationFunnel
              stages={applicationFunnel.stages}
              total={applicationFunnel.total}
            />
          )}
          <TopEmployers employers={topEmployers} />
        </div>

        {/* Recent Activity */}
        {recentActivity && (
          <RecentActivity
            activities={recentActivity.activities}
            hasMore={recentActivity.pagination.hasMore}
            onViewAll={() => console.log('Navigate to all activity')}
          />
        )}
      </div>
    </div>
  );
}
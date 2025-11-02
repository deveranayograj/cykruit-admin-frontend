// Toolbar Component
import React from "react";
import { Search } from "lucide-react";
import { StatusFilter, WorkModeFilter, EmploymentTypeFilter } from "@/types/job";

export const Toolbar: React.FC<{
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: StatusFilter;
    setStatusFilter: (status: StatusFilter) => void;
    workModeFilter: WorkModeFilter;
    setWorkModeFilter: (mode: WorkModeFilter) => void;
    employmentTypeFilter: EmploymentTypeFilter;
    setEmploymentTypeFilter: (type: EmploymentTypeFilter) => void;
}> = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, workModeFilter, setWorkModeFilter, employmentTypeFilter, setEmploymentTypeFilter }) => {
    return (
        <div className="bg-white border-b border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by job title or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="ARCHIVED">Archived</option>
                </select>

                {/* Work Mode Filter */}
                <select
                    value={workModeFilter}
                    onChange={(e) => setWorkModeFilter(e.target.value as WorkModeFilter)}
                    className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Work Modes</option>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                </select>
            </div>

            <div className="mt-4">
                {/* Employment Type Filter */}
                <select
                    value={employmentTypeFilter}
                    onChange={(e) => setEmploymentTypeFilter(e.target.value as EmploymentTypeFilter)}
                    className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Employment Types</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                </select>
            </div>
        </div>
    );
};
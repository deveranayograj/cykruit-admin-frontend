/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/contact-form-management/Toolbar.tsx
"use client";
import React from "react";
import { Search } from "lucide-react";
import { ContactFormStatus } from "@/types/contactForm";

export const Toolbar: React.FC<{
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: "all" | ContactFormStatus;
  setStatusFilter: (s: "all" | ContactFormStatus) => void;
}> = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="RESOLVED">Resolved</option>
          <option value="SPAM">Spam</option>
        </select>
      </div>
    </div>
  );
};

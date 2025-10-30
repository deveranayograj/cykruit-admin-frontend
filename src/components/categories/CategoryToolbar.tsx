// src/components/categories/CategoryToolbar.tsx
"use client";

import React from 'react';
import { Search, Plus } from 'lucide-react';

interface CategoryToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddNew: () => void;
  addButtonText?: string;
}

export const CategoryToolbar: React.FC<CategoryToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  onAddNew,
  addButtonText = "Add New"
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add New Button */}
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {addButtonText}
        </button>
      </div>
    </div>
  );
};
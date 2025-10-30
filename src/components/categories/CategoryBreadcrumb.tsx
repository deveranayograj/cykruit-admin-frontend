// src/components/categories/CategoryBreadcrumb.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CategoryBreadcrumbProps {
  categoryLabel: string;
}

export const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({ categoryLabel }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-gray-900">Home</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/admin/dashboard" className="hover:text-gray-900">Admin Dashboard</Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">{categoryLabel}</span>
    </nav>
  );
};
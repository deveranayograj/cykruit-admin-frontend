"use client";

import Link from 'next/link';
import React from 'react';
import { ChevronRight } from 'lucide-react';


export const Breadcrumb: React.FC = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-gray-900">Home</Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium cursor-pointer">Admin Dashboard</span>
    </nav>
  );
};
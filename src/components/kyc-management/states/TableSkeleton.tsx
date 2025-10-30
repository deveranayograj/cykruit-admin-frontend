"use client";
import React from 'react';

export const TableSkeleton: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b border-gray-200">
          <td className="px-6 py-4">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );
};
"use client";

import React from 'react';

type Role = 'SEEKER' | 'EMPLOYER';

export const RoleBadge: React.FC<{ role: Role }> = ({ role }) => {
  const styles = {
    SEEKER: 'bg-blue-100 text-blue-800 border-blue-200',
    EMPLOYER: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[role]}`}>
      {role === 'SEEKER' ? 'Job Seeker' : 'Employer'}
    </span>
  );
};
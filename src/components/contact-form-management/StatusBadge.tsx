// src/components/contact-form-management/StatusBadge.tsx
"use client";
import React from "react";
import { ContactFormStatus } from "@/types/contactForm";

const styles: Record<ContactFormStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  REVIEWED: "bg-blue-100 text-blue-800 border-blue-200",
  RESOLVED: "bg-green-100 text-green-800 border-green-200",
  SPAM: "bg-red-100 text-red-800 border-red-200",
};

export const StatusBadge: React.FC<{ status: ContactFormStatus }> = ({ status }) => {
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {label}
    </span>
  );
};

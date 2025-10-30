"use client";
import React from "react";
import { LucideIcon, TrendingUp } from "lucide-react";
import CountUp from "react-countup";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

interface StatCardProps {
  title: string;
  value: number;
  growth?: string;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

export function StatCard({ title, value, growth, icon: Icon, color, subtitle }: StatCardProps) {
  const { ref, inView } = useAnimateOnScroll();

  return (
    <div ref={ref} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {growth && (
          <div
            className={`flex items-center text-sm font-medium ${
              parseFloat(growth) >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            {growth}%
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-2">
        {inView ? <CountUp end={value} duration={1.5} separator="," /> : 0}
      </p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

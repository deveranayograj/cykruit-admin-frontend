"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartData } from "@/types/dashboard";

interface JobStatisticsChartProps {
  data: ChartData;
}

export function JobStatisticsChart({ data }: JobStatisticsChartProps) {
  const { ref, inView } = useAnimateOnScroll(0.2);

  const chartData = data.labels.map((label, idx) => ({
    name: label,
    posted: data.datasets[0].data[idx],
    filled: data.datasets[1].data[idx],
  }));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Statistics</h3>
      {inView && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="posted" fill="#8b5cf6" name="Jobs Posted" />
            <Bar dataKey="filled" fill="#f59e0b" name="Jobs Filled" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}

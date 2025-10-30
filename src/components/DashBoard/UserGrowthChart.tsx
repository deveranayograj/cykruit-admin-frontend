"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartData } from "@/types/dashboard";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

interface UserGrowthChartProps {
  data: ChartData;
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const { ref, inView } = useAnimateOnScroll(0.2);

  const chartData = data.labels.map((label, idx) => ({
    name: label,
    seekers: data.datasets[0].data[idx],
    employers: data.datasets[1].data[idx],
  }));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>

      {inView && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <motion.g
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <Line
                type="monotone"
                dataKey="seekers"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Job Seekers"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="employers"
                stroke="#10b981"
                strokeWidth={2}
                name="Employers"
                dot={false}
                isAnimationActive={false}
              />
            </motion.g>
          </LineChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}

// src/components/charts/ClassificationPie.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Box, Typography } from "@mui/material";
import { Classification } from "@/types/SkinAnalysisResult";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export function ClassificationPie({
  title,
  data,
}: {
  title: string;
  data: Classification;
}) {
  const chartData = Object.entries(data.all_scores).map(([k, v]) => ({
    name: k,
    value: Math.round(v * 100),
  }));

  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <PieChart width={220} height={220}>
        <Pie
          dataKey="value"
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={40}
          label
        >
          {chartData.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => `${v}%`} />
      </PieChart>
      <Typography variant="body2" fontWeight="bold">
        Top: {data.label} ({Math.round(data.score * 100)}%)
      </Typography>
    </Box>
  );
}

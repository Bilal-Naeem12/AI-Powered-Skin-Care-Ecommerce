// src/components/charts/ClassificationPie.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Box, Typography } from "@mui/material";
import { Classification } from "@/types/SkinAnalysisResult";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
const severityLabelMap: Record<string, string> = {
  "level -1": "Clear",
  "level 0": "Mild",
  "level 1": "Moderate",
  "level 2": "Severe",
  "level 3": "Very Severe",
};
export function ClassificationPie({
  title,
  data,
}: {
  title: string;
  data: Classification;
}) {
  const chartData = Object.entries(data.all_scores).map(([k, v]) => ({
   name: severityLabelMap[k] || k,
    value: Math.round(v * 100),
  }));
  const topLabel = severityLabelMap[data.label] || data.label;

  return (
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    mb: 4,
    width: "100%", // allow it to take full container
    maxWidth: 320, // give more space than before
    mx: "auto",
  }}
>
  <Typography variant="subtitle1" gutterBottom>
    {title}
  </Typography>

  <PieChart width={280} height={280}>
    <Pie
      dataKey="value"
      data={chartData}
      cx="50%"
      cy="50%"
      outerRadius={100}
      innerRadius={45}
      label
      labelLine={true}
    >
      {chartData.map((_, idx) => (
        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip formatter={(value) => typeof value === "number" ? `${value}%` : "—"} />
  </PieChart>

  <Typography variant="body2" className="capitalize" fontWeight="bold">
    Top: {topLabel} ({Math.round(data.score * 100)}%)
  </Typography>
</Box>

  );
}

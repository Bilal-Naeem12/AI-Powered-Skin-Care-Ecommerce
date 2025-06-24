// src/components/charts/DetectionsBar.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Box, Typography } from "@mui/material";
import { Detections } from "@/types/SkinAnalysisResult";

export function DetectionsBar({ detections }: { detections: Detections }) {
  const chartData = Object.entries(detections).map(([k, v]) => ({
    name: k.replace("_", " "),
    count: v.objects.length,
  }));

  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography variant="subtitle1" gutterBottom>
        Detected Objects
      </Typography>
      <BarChart width={280} height={220} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count">
          {chartData.map((_, idx) => (
            <Cell key={idx} />
          ))}
        </Bar>
      </BarChart>
    </Box>
  );
}

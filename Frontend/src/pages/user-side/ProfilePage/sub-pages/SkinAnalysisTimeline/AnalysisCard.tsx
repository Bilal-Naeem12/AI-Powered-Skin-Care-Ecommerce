import React from "react";
import { Paper, Avatar, Typography } from "@mui/material";
import { SkinHistoryEntry } from "@/types/SkinHistoryEntry";
const severityLabelMap: Record<string, string> = {
  "level -1": "Clear",
  "level 0": "Mild",
  "level 1": "Moderate",
  "level 2": "Severe",
  "level 3": "Very Severe"
};

export function AnalysisCard({
  entry,
  onClick,
}: {
  entry: SkinHistoryEntry;
  onClick: () => void;
}) {
const rawLabel = entry.classifications.acne_severity.label;
const topLabel = severityLabelMap[rawLabel] || rawLabel;
  const date = new Date(entry.analyzedAt);

  return (
    <Paper 
      elevation={2} 
      sx={{ p: 2, cursor: "pointer", height: "100%" }} 
      onClick={onClick}
    >
      <Avatar 
        variant="rounded" 
        src={entry.scanned_image_after || entry.scanned_image_before} 
        sx={{ width: "100%", height: 140, mb: 1 }} 
      />
      <Typography variant="subtitle2">
        {date.toLocaleDateString()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Acne: {topLabel}
      </Typography>
    </Paper>
  );
}

import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Drawer,
  Divider,
} from "@mui/material";
import { SkinHistoryEntry } from "@/types/SkinHistoryEntry";

export function AnalysisDetail({
  open,
  onClose,
  entry,
}: {
  open: boolean;
  onClose: () => void;
  entry: SkinHistoryEntry | null;
}) {
  if (!entry) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Analysis Detail
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Avatar
          variant="rounded"
          src={entry.scanned_image_after || entry.scanned_image_before}
          sx={{ width: "100%", height: 200, mb: 2 }}
        />

        <Typography variant="subtitle1">Date:</Typography>
        <Typography paragraph>{new Date(entry.analyzedAt).toLocaleString()}</Typography>

        <Typography variant="subtitle1">Skin Type:</Typography>
        <Typography paragraph>
          {entry.classifications.skin_type.label} (
          {(entry.classifications.skin_type.score * 100).toFixed(0)}%)
        </Typography>

        <Typography variant="subtitle1">Acne Severity:</Typography>
        <Typography paragraph>
          {entry.classifications.acne_severity.label} (
          {(entry.classifications.acne_severity.score * 100).toFixed(0)}%)
        </Typography>

        <Typography variant="subtitle1">Detections:</Typography>
        {Object.entries(entry.detections).map(([key, { objects }]) => (
          <Box key={key} sx={{ mb: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {key.replace("_", " ") || key}:
            </Typography>
            {objects.length ? (
              objects.map((obj, i) => (
                <Typography key={i} variant="body2">
                  • {obj.class ?? "Detected"} ({(obj.confidence * 100).toFixed(0)}%)
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                None
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}

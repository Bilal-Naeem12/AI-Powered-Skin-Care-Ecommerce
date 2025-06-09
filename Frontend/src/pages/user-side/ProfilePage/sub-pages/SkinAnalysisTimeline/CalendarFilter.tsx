
// src/components/SkinAnalysisTimeline.tsx
import React, { useState, useMemo } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  Paper,
  Avatar,
  Button,
  Drawer,
  Divider,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { SkinAnalysisResult } from "@/types/SkinAnalysisResult";

// ── Calendar Filter ─────────────────────────────────────────────────────────
export function CalendarFilter({
  selectedDate,
  onChange,
}: {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Filter by date"
        inputFormat="dd/MM/yyyy"
        value={selectedDate}
        onChange={onChange}
        renderInput={(props) => (
          <Button 
            {...props} 
            startIcon={<CalendarTodayIcon />} 
            variant="outlined" 
          >
            {selectedDate
              ? props.inputProps?.value
              : "All Dates"}
          </Button>
        )}
      />
    </LocalizationProvider>
  );
}



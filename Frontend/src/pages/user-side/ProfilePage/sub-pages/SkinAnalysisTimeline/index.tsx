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

// ── Mock Data ───────────────────────────────────────────────────────────────
const mockData: Array<{ 
  id: string;
  date: Date;
  result: SkinAnalysisResult;
}> = [
  {
    id: "1",
    date: new Date("2025-06-01"),
    result: {
      scanned_image: "/assets/example1.jpg",
      classifications: {
        acne_severity: { label: "Moderate", score: 0.75, all_scores: { mild:0.1, moderate:0.75, severe:0.15 } },
        skin_type: { label: "Oily", score: 0.85, all_scores: { dry:0.05, normal:0.1, oily:0.85 } },
      },
      detections: {
        acne: { objects: [ { bbox:[10,20,50,60], class:"acne", confidence:0.92 } ] },
        puffy_eyes: { objects: [ ] },
      }
    }
  },
  {
    id: "2",
    date: new Date("2025-06-08"),
    result: {
      scanned_image: "/assets/example2.jpg",
      classifications: {
        acne_severity: { label: "Mild", score: 0.25, all_scores: { mild:0.25, moderate:0.5, severe:0.25 } },
        skin_type: { label: "Normal", score: 0.60, all_scores: { dry:0.2, normal:0.6, oily:0.2 } },
      },
      detections: {
        acne: { objects: [] },
        puffy_eyes: { objects: [ { bbox:[30,40,20,15], class:"puffy_eyes", confidence:0.88 } ] },
      }
    }
  },
];

// ── Calendar Filter ─────────────────────────────────────────────────────────
function CalendarFilter({
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

// ── Analysis Summary Card ───────────────────────────────────────────────────
function AnalysisCard({
  entry,
  onClick,
}: {
  entry: typeof mockData[number];
  onClick: () => void;
}) {
  const { date, result } = entry;
  const topLabel = result.classifications.acne_severity.label;
  return (
    <Paper 
      elevation={2} 
      sx={{ p:2, cursor: "pointer", height: "100%" }} 
      onClick={onClick}
    >
      <Avatar 
        variant="rounded" 
        src={result.scanned_image} 
        sx={{ width: "100%", height: 140, mb:1 }} 
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

// ── Analysis Detail Drawer ──────────────────────────────────────────────────
function AnalysisDetail({
  open,
  onClose,
  entry,
}: {
  open: boolean;
  onClose: () => void;
  entry: typeof mockData[number] | null;
}) {
  if (!entry) return null;
  const { date, result } = entry;
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Analysis Detail
        </Typography>
        <Divider sx={{ mb:2 }} />

        <Avatar 
          variant="rounded" 
          src={result.scanned_image} 
          sx={{ width: "100%", height: 200, mb:2 }} 
        />

        <Typography variant="subtitle1">Date:</Typography>
        <Typography paragraph>{date.toLocaleString()}</Typography>

        <Typography variant="subtitle1">Skin Type:</Typography>
        <Typography paragraph>
          {result.classifications.skin_type.label} (
          {(result.classifications.skin_type.score*100).toFixed(0)}%)
        </Typography>

        <Typography variant="subtitle1">Acne Severity:</Typography>
        <Typography paragraph>
          {result.classifications.acne_severity.label} (
          {(result.classifications.acne_severity.score*100).toFixed(0)}%)
        </Typography>

        <Typography variant="subtitle1">Detections:</Typography>
        {Object.entries(result.detections).map(([key, { objects }]) => (
          <Box key={key} sx={{ mb:1 }}>
            <Typography variant="body2" fontWeight="bold">
              {key.replace("_"," ") || key}:
            </Typography>
            {objects.length ? (
              objects.map((obj, i) => (
                <Typography key={i} variant="body2">
                  • {obj.class} ({(obj.confidence*100).toFixed(0)}%)
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

// ── Main Component ──────────────────────────────────────────────────────────
export default function SkinAnalysisTimeline() {
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [selected, setSelected] = useState<typeof mockData[number] | null>(null);

  // filter by exact day
  const filtered = useMemo(() => {
    if (!filterDate) return mockData;
    return mockData.filter((e) => 
      e.date.toDateString() === filterDate.toDateString()
    );
  }, [filterDate]);

  return (
    <Container sx={{ py:4 }}>
      <Typography variant="h4" gutterBottom>
        Skin Analysis History
      </Typography>

      <CalendarFilter 
        selectedDate={filterDate} 
        onChange={setFilterDate} 
      />

      <Box sx={{ mt:3 }}>
        <Grid container spacing={2}>
          {filtered.map((entry) => (
            <Grid item xs={12} sm={6} md={4} key={entry.id}>
              <AnalysisCard 
                entry={entry} 
                onClick={() => setSelected(entry)} 
              />
            </Grid>
          ))}
          {filtered.length === 0 && (
            <Typography color="text.secondary" sx={{ mt:4 }}>
              No analyses found for this date.
            </Typography>
          )}
        </Grid>
      </Box>

      <AnalysisDetail 
        open={!!selected} 
        onClose={() => setSelected(null)} 
        entry={selected} 
      />
    </Container>
  );
}

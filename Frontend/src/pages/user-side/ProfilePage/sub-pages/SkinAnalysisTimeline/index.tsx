// src/components/SkinAnalysisTimeline.tsx
import React, { useState, useMemo, useEffect } from "react";
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
import { CalendarFilter } from "./CalendarFilter";
import { AnalysisCard } from "./AnalysisCard";
import { AnalysisDetail } from "./AnalysisDetail";
import useUserStore from "@/store/useUserStore";
import { SkinHistoryEntry } from "@/types/SkinHistoryEntry";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { SkinHistoryPaginatedResponse } from "@/types/SkinHistoryPaginatedResponse";

// ── Mock Data ───────────────────────────────────────────────────────────────
export const mockData: Array<{ 
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
        acne: { objects: [ { bbox:[10,20,50,60], confidence:0.92 } ] },
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
        puffy_eyes: { objects: [ { bbox:[30,40,20,15], confidence:0.88 } ] },
      }
    }
  },
];


// ── Main Component ──────────────────────────────────────────────────────────
export default function SkinAnalysisTimeline() {
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  // filter by exact day
  const filtered = useMemo(() => {
    if (!filterDate) return mockData;
    return mockData.filter((e) => 
      e.date.toDateString() === filterDate.toDateString()
    );
  }, [filterDate]);


  const { user } = useUserStore();
const [page, setPage] = useState(0);
const [entries, setEntries] = useState<SkinHistoryEntry[]>([]);
const [hasMore, setHasMore] = useState(true);
const [selected, setSelected] = useState<SkinHistoryEntry | null>(null);
const limit = 6;
const { data, loading, error } = useFetchAuthData<SkinHistoryPaginatedResponse>(
  `${import.meta.env.VITE_API_BACKEND_URL}/skin-history/user/${user?._id}?skip=${page * limit}&limit=${limit}`
);

useEffect(() => {
  if (data?.entries?.length) {
    setEntries(prev => [...prev, ...data.entries]);
    if (data.entries.length < limit || data.page + 1 >= data.totalPages) {
      setHasMore(false);
    }
  } else {
    setHasMore(false);
  }
}, [data]);
  return (
   <Container sx={{ py: 4 }}>
  <Typography variant="h4" gutterBottom>
    Skin Analysis History
  </Typography>

  <CalendarFilter selectedDate={filterDate} onChange={setFilterDate} />

  <Box sx={{ mt: 3 }}>
    <Grid container spacing={2}>
      {entries.map((entry) => (
        <Grid item xs={12} sm={6} md={4} key={entry._id}>
          <AnalysisCard 
            entry={entry} 
            onClick={() => setSelected(entry)} 
          />
        </Grid>
      ))}

      {entries.length === 0 && (
        <Typography sx={{ mt: 4, px: 2 }} color="text.secondary">
          No analyses found.
        </Typography>
      )}

      {hasMore && (
        <Grid item xs={12}>
          <Button
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
            fullWidth
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </Grid>
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

// src/components/SkinAnalysisTimeline.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { CalendarFilter } from "./CalendarFilter";
import { AnalysisCard } from "./AnalysisCard";
import useUserStore from "@/store/useUserStore";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { SkinHistoryEntry } from "@/types/SkinHistoryEntry";
import { SkinHistoryPaginatedResponse } from "@/types/SkinHistoryPaginatedResponse";
import { useNavigate } from "react-router-dom";

export default function SkinAnalysisTimeline() {
  const navigate = useNavigate();

  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const { user } = useUserStore();
  const [page, setPage] = useState(0);
  const [entries, setEntries] = useState<SkinHistoryEntry[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 15;

  const { data, loading } = useFetchAuthData<SkinHistoryPaginatedResponse>(
    `${import.meta.env.VITE_API_BACKEND_URL}/skin-history/user/${user?._id}?skip=${page *
      limit}&limit=${limit}`
  );

  useEffect(() => {
    if (data?.entries?.length) {
      setEntries((prev) => [...prev, ...data.entries]);
      if (data.entries.length < limit || data.page + 1 >= data.totalPages) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  }, [data]);

  // optional: date filter
  const filtered = useMemo(() => {
    if (!filterDate) return entries;
    return entries.filter(
      (e) => new Date(e.analyzedAt).toDateString() === filterDate.toDateString()
    );
  }, [entries, filterDate]);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Skin Analysis History
      </Typography>

      <CalendarFilter selectedDate={filterDate} onChange={setFilterDate} />

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {filtered.map((entry) => (
            <Grid item xs={12} sm={6} md={4} key={entry._id}>
              <AnalysisCard
                entry={entry}
                onClick={() => navigate(`${entry._id}`)}
              />
            </Grid>
          ))}

          {filtered.length === 0 && (
            <Typography sx={{ mt: 4, px: 2 }} color="text.secondary">
              No analyses found.
            </Typography>
          )}

          {hasMore && (
            <Grid item xs={12}>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
                fullWidth
              >
                {loading ? "Loading…" : "Load More"}
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

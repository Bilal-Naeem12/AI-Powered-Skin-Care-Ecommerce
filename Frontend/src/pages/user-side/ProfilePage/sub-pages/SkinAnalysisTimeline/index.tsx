// src/components/SkinAnalysisTimeline.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Button,
  Stack,
  Card,
} from "@mui/material";
import { CalendarFilter } from "./CalendarFilter";
import { AnalysisCard } from "./AnalysisCard";
import useUserStore from "@/store/UserStore";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { SkinHistoryEntry } from "@/types/SkinHistoryEntry";
import { SkinHistoryPaginatedResponse } from "@/types/SkinHistoryPaginatedResponse";
import { useNavigate } from "react-router-dom";

const LIMIT = 15;

export default function SkinAnalysisTimeline() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(0);
  const [entries, setEntries] = useState<SkinHistoryEntry[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  /* ---------- build URL ---------- */
 const fetchUrl = useMemo(() => {
  const base = `${import.meta.env.VITE_API_BACKEND_URL}/skin-history/user/${user?._id}`;

  const qs = new URLSearchParams({
    page : String(page + 1),
    limit: String(LIMIT),
  });

  if (filterDate) {
    // format YYYY-MM-DD in *local* time, no UTC shift
    const y  = filterDate.getFullYear();
    const m  = String(filterDate.getMonth() + 1).padStart(2, "0");
    const d  = String(filterDate.getDate()).padStart(2, "0");
    qs.set("date", `${y}-${m}-${d}`);
  }

  return `${base}?${qs.toString()}`;
}, [user?._id, page, filterDate]);

  const { data, loading } =
    useFetchAuthData<SkinHistoryPaginatedResponse>(fetchUrl);

  /* ---------- merge new data ---------- */
  useEffect(() => {
    if (!data) return;

    if (data.entries.length) {
      setEntries((prev) => {
        const seen = new Set(prev.map((e) => e._id));
        const fresh = data.entries.filter((e) => !seen.has(e._id));
        return [...prev, ...fresh];
      });

      if (data.entries.length < LIMIT || data.page >= data.totalPages) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  }, [data]);

  /* ---------- reset when date changes ---------- */
  useEffect(() => {
    setPage(0);
    setEntries([]);
    setHasMore(true);
  }, [filterDate]);

  /* ---------- infinite scroll ---------- */
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((p) => p + 1);
      }
    },
    [hasMore, loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });
    const node = loaderRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [onIntersect]);

  /* ---------- UI ---------- */
  return (
    <Card sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Skin Analysis History
      </Typography>

      {/* Calendar + clear button */}
      <Stack direction="row" spacing={2} alignItems="center">
        <CalendarFilter selectedDate={filterDate} onChange={setFilterDate} />
        {filterDate && (
          <Button
            variant="outlined"
            onClick={() => setFilterDate(null)}
            size="small"
          >
            Clear date
          </Button>
        )}
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {entries.map((entry) => (
            <Grid item xs={12} sm={6} md={4} key={entry._id}>
              <AnalysisCard
                entry={entry}
                onClick={() => navigate(`${entry._id}`)}
              />
            </Grid>
          ))}

          {entries.length === 0 && !loading && (
            <Typography sx={{ mt: 4, px: 2 }} color="text.secondary">
              No analyses found.
            </Typography>
          )}

          {hasMore && (
            <Grid item xs={12}>
              <Box
                ref={loaderRef}
                sx={{
                  height: 60,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loading && <CircularProgress size={24} />}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Card>
  );
}

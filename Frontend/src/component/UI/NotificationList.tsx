// src/components/NotificationList.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  List, ListItem, ListItemAvatar, ListItemText, Avatar,
  Typography, Chip, Stack, Box, Divider, CircularProgress,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/useUserStore";
import { NotificationItem, NotificationKind } from "@/types/NotificationItem";
import axios from "axios";          // ← USE CONFIGURED INSTANCE !!!

/* ------------------------------------------------------------------ */
/* 1.  Labels & Avatar mapping                                         */
/* ------------------------------------------------------------------ */
const kindLabels: Record<NotificationKind, string> = {
    ANALYSIS_RESULT:    "Analysis",

  ORDER_STATUS:       "Order Status",
    PROMO:              "Promotions",
  ORDER_PLACED:       "Order Placed",


};

const kindAvatars: Partial<Record<NotificationKind, string>> = {
  ANALYSIS_RESULT:   "/assets/icons/ANALYSIS_RESULT.png",
  ORDER_STATUS:      "/assets/icons/ORDER_STATUS.png",
  ORDER_PLACED:      "/assets/icons/ORDER_PLACED.png",
  PROMO:             "/assets/icons/PROMO.png",
  ACCOUNT_SUSPENDED: "/assets/icons/ACCOUNT_SUSPENDED.png",
};
/* ------------------------------------------------------------------ */

const MAX_SHOWN = 20;

const NotificationList: React.FC = () => {
  const { user } = useUserStore();
  const uid       = user?._id || "";                 // avoid undefined
  const navigate  = useNavigate();

  const [loading,        setLoading]        = useState(true);
  const [notifications,  setNotifications]  = useState<NotificationItem[]>([]);
  const [filter,         setFilter]         = useState<NotificationKind | "ALL">("ALL");

  /* ----------------------------------------------------------------
     2. Fetch on mount (or when user id changes)
  ---------------------------------------------------------------- */
  useEffect(() => {
    if (!uid) return;                       // wait for user to be loaded

    (async () => {
      try {
        const res = await axios.get<{ notifications: NotificationItem[] }>(
        `${import.meta.env.VITE_API_BACKEND_URL}/notifications`,            // baseURL already prepended
          { withCredentials: true }
        );

        const all = Array.isArray(res.data) ? res.data : res.data.notifications || [];

        // unread first → newest first → max 20
        const sorted = all
          .sort((a, b) => {
            const aRead = a.readBy?.some((r) => r.userId === uid);
            const bRead = b.readBy?.some((r) => r.userId === uid);
            return Number(aRead) - Number(bRead) ||
                   new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .slice(0, MAX_SHOWN);

        setNotifications(sorted);
      } catch (err) {
        console.error("🔴 Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [uid]);

  /* ----------------------------------------------------------------
     3. Derived lists (memoised)
  ---------------------------------------------------------------- */
  const { unread, read } = useMemo(() => {
    const base =
      filter === "ALL" ? notifications : notifications.filter((n) => n.kind === filter);

    return {
      unread: base.filter((n) => !n.readBy?.some((r) => r.userId === uid)),
      read:   base.filter((n) =>  n.readBy?.some((r) => r.userId === uid)),
    };
  }, [filter, notifications, uid]);

  /* ----------------------------------------------------------------
     4. Click → mark-as-read + navigate
  ---------------------------------------------------------------- */
  const handleClick = async (notif: NotificationItem) => {
    const isRead = notif.readBy?.some((r) => r.userId === uid);

    if (!isRead) {
      try {
        await axios.patch(`/notifications/${notif._id}/read`, {}, { withCredentials: true });
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notif._id
              ? { ...n, readBy: [...(n.readBy || []), { userId: uid, readAt: new Date().toISOString() }] }
              : n
          )
        );
      } catch (err) {
        console.warn("Could not mark as read", err);
      }
    }

    if (notif.kind === "ANALYSIS_RESULT" && (notif as any).data?.skinHistoryId) {
      navigate(`/profile-page/analysis-timeline/${(notif as any).data.skinHistoryId}`);
    }
  };

  /* ----------------------------------------------------------------
     5. Render
  ---------------------------------------------------------------- */
  if (loading) {
    return (
      <Box sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  const combined = [...unread, ...read];

  return (
    <Box>
      {/* chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
        {(["ALL", ...Object.keys(kindLabels)] as const).map((k) => (
          <Chip
            key={k}
            label={k === "ALL" ? "All" : kindLabels[k as NotificationKind]}
            variant={filter === k ? "filled" : "outlined"}
            color={filter === k ? "primary" : "default"}
            size="small"
            onClick={() => setFilter(k as NotificationKind | "ALL")}
          />
        ))}
      </Stack>

      {/* list */}
      {combined.length === 0 ? (
        <Typography color="text.secondary">No notifications.</Typography>
      ) : (
        <List disablePadding>
          {combined.map((n, idx) => (
            <React.Fragment key={n._id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: n.readBy?.some((r) => r.userId === uid)
                    ? "transparent"
                    : "#ffeaf6",
                  "&:hover": { bgcolor: "#f8f8f8", cursor: "pointer" },
                }}
                onClick={() => handleClick(n)}
              >
                <ListItemAvatar>
                 <Avatar
  src={n.image || kindAvatars[n.kind]}
  imgProps={{ style: { objectFit: "contain",   ...(n.image ? {} : { padding: 6 }),} }}
  sx={{
    bgcolor: "#ffa8d3", // light pink background
    width: 48,
    height: 48,
    fontSize: 24,
  }}
>
  {!(n.image || kindAvatars[n.kind]) && n.title[0]}
</Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={n.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {n.body}
                      </Typography>
                      {" — "}
                      <Typography component="span" variant="caption" color="text.disabled">
                        {new Date(n.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                {!n.readBy?.some((r) => r.userId === uid) && (
                  <CircleIcon fontSize="small" sx={{ color: "#FF69B4", ml: 1 }} />
                )}
              </ListItem>

              {idx !== combined.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationList;

// src/components/NotificationList.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Stack,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useNotificationStore from "@/store/NotificationStore";
import useUserStore from "@/store/UserStore";
import { NotificationItem, ReadState, NotificationKind } from "@/types/NotificationItem";

const MAX_SHOWN = 20;

// 1) Labels for each user-side kind
const kindLabels: Record<NotificationKind, string> = {
  ANALYSIS_RESULT: "Analysis Result",
  ORDER_STATUS:    "Order Status",
  PROMO:           "Promotion",
  ORDER_PLACED:    "Order Placed",
  FEEDBACK_REPLY:  "Support Reply",
  // these won’t appear on user side but TS needs them:
 
   NEW_ORDER:        "",
  STOCK_LOW:        "",
  REPORT_RECEIVED:  "",
  ANALYSIS_ALERT:   "",
  ACCOUNT_SUSPENDED:"",
  ACCOUNT_RESTORED: "",
  ROLE_CHANGED:     "",
  // admin-only
  MANAGEMENT_ORDER_PLACED:   "",
  MANAGEMENT_REFUND_REQUEST: "",
  CONTACT_MESSAGE:           "",
   NEW_USER:         "",
  
};

// 2) Avatars for each kind
const kindAvatars: Partial<Record<NotificationKind, string>> = {
  ANALYSIS_RESULT: "/assets/icons/ANALYSIS_RESULT.png",
  ORDER_STATUS:    "/assets/icons/ORDER_STATUS.png",
  PROMO:           "/assets/icons/PROMO.png",
  ORDER_PLACED:    "/assets/icons/ORDER_PLACED.png",
  FEEDBACK_REPLY:  "/assets/icons/FEEDBACK_REPLY.png",
   MANAGEMENT_ORDER_PLACED: "/assets/icons/ORDER_PLACED.png",
  MANAGEMENT_REFUND_REQUEST:"/assets/icons/MANAGEMENT_REFUND_REQUEST.png",
    CONTACT_MESSAGE:"/assets/icons/CONTACT_MESSAGE.png",
    NEW_USER:"/assets/icons/NEW_USER.png",
};

export default function NotificationList() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const uid = user?._id ?? "";

  const { notifications, setNotifications } = useNotificationStore();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NotificationKind | "ALL">("ALL");
const kinds = useMemo(() => {
  const set = new Set<NotificationKind>();
  notifications.forEach((n) => set.add(n.kind));
  return ["ALL", ...Array.from(set)] as (NotificationKind | "ALL")[];
}, [notifications]);


  // 3) Fetch for user on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<NotificationItem[]>(
          `${import.meta.env.VITE_API_BACKEND_URL}/notifications`,
          { withCredentials: true }
        );
        const all = res.data;

        // sort: unread first, then newest first
        all.sort((a, b) => {
          const aRead = a.readBy?.some((r) => r.userId === uid) ? 1 : 0;
          const bRead = b.readBy?.some((r) => r.userId === uid) ? 1 : 0;
          if (aRead !== bRead) return aRead - bRead;
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        });

        setNotifications(all.slice(0, MAX_SHOWN));
      } catch (err) {
        console.error("🔴 Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [setNotifications, uid]);

  // 4) Memoize unread/read splits
  const { unread, read } = useMemo(() => {
    const base =
      filter === "ALL"
        ? notifications
        : notifications.filter((n) => n.kind === filter);

    return {
      unread: base.filter(
        (n) => !n.readBy?.some((r) => r.userId === uid)
      ),
      read: base.filter((n) =>
        n.readBy?.some((r) => r.userId === uid)
      ),
    };
  }, [filter, notifications, uid]);

  // 5) Mark-as-read + navigate
  const handleClick = async (notif: NotificationItem) => {
    try {
      const isRead = notif.readBy?.some((r) => r.userId === uid);
      if (!isRead) {
        await axios.patch(
          `${import.meta.env.VITE_API_BACKEND_URL}/notifications/${notif._id}/read`,
          {},
          { withCredentials: true }
        );

        // build a new array with the ReadState fully typed
        const updated = notifications.map((n) =>
          n._id === notif._id
            ? {
                ...n,
                readBy: [
                  ...(n.readBy || []),
                  { userId: uid, readAt: new Date().toISOString() } as ReadState,
                ],
              }
            : n
        );
        setNotifications(updated);
      }

      // route based on kind
      const data = notif.data as any;
      if (
        notif.kind === "ANALYSIS_RESULT" &&
        data.skinHistoryId
      ) {
        navigate(
          `/profile-page/analysis-timeline/${data.skinHistoryId}`
        );
      } else if (
        (notif.kind === "ORDER_PLACED" ||
         notif.kind === "ORDER_STATUS") &&
        data.orderId
      ) {
        navigate(`/profile-page/orders/${data.orderId}`);
      } else if (
        notif.kind === "FEEDBACK_REPLY" &&
        data.ticketId
      ) {
        navigate(`/profile-page/support/${data.ticketId}`);
      }
    } catch (err) {
      console.error("❌ Failed to mark notification as read", err);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    );

  const combined = [...unread, ...read];

  return (
    <Box>
      {/* filter chips */}
<Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
  {kinds.map((k) => {
    const label = k === "ALL" ? "All" : kindLabels[k] ?? k;
    return (
      <Chip
        key={k}
        label={label}
        variant={filter === k ? "filled" : "outlined"}
        size="small"
        onClick={() => setFilter(k)}
      />
    );
  })}
</Stack>
      {/* list */}
      {combined.length === 0 ? (
        <Typography color="text.secondary">
          No notifications.
        </Typography>
      ) : (
        <List disablePadding>
          {combined.map((n, i) => (
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
                    src={n.image||kindAvatars[n.kind]}
                    imgProps={{
                      style: {
                        objectFit: "contain",
                        padding: n.image ? 0 : 6,
                      },
                    }}
                    sx={{
                      bgcolor: "#ffa8d3",
                      width: 48,
                      height: 48,
                      fontSize: 24,
                    }}
                  >
                    {!(n.image || kindAvatars[n.kind]) &&
                      n.title[0]}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={n.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {n.body}
                      </Typography>
                      {" — "}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.disabled"
                      >
                        {new Date(n.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />

                {!n.readBy?.some((r) => r.userId === uid) && (
                  <CircleIcon
                    fontSize="small"
                    sx={{ color: "#FF69B4", ml: 1 }}
                  />
                )}
              </ListItem>

              {i !== combined.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

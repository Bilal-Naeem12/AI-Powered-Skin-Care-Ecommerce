// src/components/NotificationList.tsx
import React from "react";
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
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

export type NotificationKind =
  | "ANALYSIS_READY"
  | "ORDER_STATUS"
  | "PROMO"
  | "SKIN_REMINDER"
  | "SYSTEM";

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  description?: string;
  image?: string;
  createdAt: string;
  read?: boolean;
}

// ⬇️ temporary seed data — replace with real-time store
const mockNotifications: NotificationItem[] = [
  {
    id: "n-1",
    kind: "ANALYSIS_READY",
    title: "✨ Your latest skin analysis is ready",
    description: "Tap to view detailed results and product picks.",
    createdAt: "2025-06-26T09:00:00Z",
    image: "/icons/analysis.png",
    read: false,
  },
  {
    id: "n-2",
    kind: "ORDER_STATUS",
    title: "📦 Order #1023 out for delivery",
    description: "Expected arrival: today by 5 PM.",
    createdAt: "2025-06-25T15:26:00Z",
    image: "/icons/package.png",
    read: true,
  },
  {
    id: "n-3",
    kind: "PROMO",
    title: "🎁 15 % off on brightening serums",
    description: "Limited-time offer. Expires in 24 h.",
    createdAt: "2025-06-25T12:40:00Z",
    image: "/icons/discount.png",
    read: true,
  },
   {
    id: "n-1",
    kind: "ANALYSIS_READY",
    title: "✨ Your latest skin analysis is ready",
    description: "Tap to view detailed results and product picks.",
    createdAt: "2025-06-26T09:00:00Z",
    image: "/icons/analysis.png",
    read: false,
  },
  {
    id: "n-2",
    kind: "ORDER_STATUS",
    title: "📦 Order #1023 out for delivery",
    description: "Expected arrival: today by 5 PM.",
    createdAt: "2025-06-25T15:26:00Z",
    image: "/icons/package.png",
    read: true,
  },
  {
    id: "n-3",
    kind: "PROMO",
    title: "🎁 15 % off on brightening serums",
    description: "Limited-time offer. Expires in 24 h.",
    createdAt: "2025-06-25T12:40:00Z",
    image: "/icons/discount.png",
    read: true,
  },
   {
    id: "n-1",
    kind: "ANALYSIS_READY",
    title: "✨ Your latest skin analysis is ready",
    description: "Tap to view detailed results and product picks.",
    createdAt: "2025-06-26T09:00:00Z",
    image: "/icons/analysis.png",
    read: false,
  },
  {
    id: "n-2",
    kind: "ORDER_STATUS",
    title: "📦 Order #1023 out for delivery",
    description: "Expected arrival: today by 5 PM.",
    createdAt: "2025-06-25T15:26:00Z",
    image: "/icons/package.png",
    read: true,
  },
  {
    id: "n-3",
    kind: "PROMO",
    title: "🎁 15 % off on brightening serums",
    description: "Limited-time offer. Expires in 24 h.",
    createdAt: "2025-06-25T12:40:00Z",
    image: "/icons/discount.png",
    read: true,
  },
   {
    id: "n-1",
    kind: "ANALYSIS_READY",
    title: "✨ Your latest skin analysis is ready",
    description: "Tap to view detailed results and product picks.",
    createdAt: "2025-06-26T09:00:00Z",
    image: "/icons/analysis.png",
    read: false,
  },
  {
    id: "n-2",
    kind: "ORDER_STATUS",
    title: "📦 Order #1023 out for delivery",
    description: "Expected arrival: today by 5 PM.",
    createdAt: "2025-06-25T15:26:00Z",
    image: "/icons/package.png",
    read: true,
  },
  {
    id: "n-3",
    kind: "PROMO",
    title: "🎁 15 % off on brightening serums",
    description: "Limited-time offer. Expires in 24 h.",
    createdAt: "2025-06-25T12:40:00Z",
    image: "/icons/discount.png",
    read: true,
  },
];

const kindLabels: Record<NotificationKind, string> = {
  ANALYSIS_READY: "Analysis",
  ORDER_STATUS: "Orders",
  PROMO: "Promos",
  SKIN_REMINDER: "Reminders",
  SYSTEM: "System",
};

const NotificationList: React.FC = () => {
  const [filter, setFilter] = React.useState<NotificationKind | "ALL">("ALL");

  const filtered = React.useMemo(
    () =>
      filter === "ALL"
        ? mockNotifications
        : mockNotifications.filter((n) => n.kind === filter),
    [filter]
  );

  return (
    <Box>
      {/* --- category filter chips --- */}
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

      {/* --- list --- */}
      {filtered.length === 0 ? (
        <Typography color="text.secondary">No notifications.</Typography>
      ) : (
        <List disablePadding>
          {filtered.map((n, idx) => (
            <React.Fragment key={n.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: n.read ? "transparent" : "#ffeaf6",
                  "&:hover": { bgcolor: "#f8f8f8", cursor: "pointer" },
                }}
                // 👉 handle click / mark-as-read here
              >
                <ListItemAvatar>
                  <Avatar
                    src={n.image}
                    sx={{
                      bgcolor: "#FF69B4",
                      width: 48,
                      height: 48,
                      fontSize: 24,
                    }}
                  >
                    {n.image ? null : n.title[0]}
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
                        {n.description}
                      </Typography>
                      {` — `}
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
                {!n.read && (
                  <CircleIcon
                    fontSize="small"
                    sx={{ color: "#FF69B4", ml: 1 }}
                  />
                )}
              </ListItem>
              {idx !== filtered.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationList;

// src/components/NotificationBell.tsx
import React from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

import { Link } from "react-router-dom";

/** ----------------------------------------------------------------
 *   1. Dummy data – replace with real-time payloads from Socket.IO
 *  ----------------------------------------------------------------*/
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
  image?: string; // optional thumbnail
  createdAt: string; // ISO date string
  read?: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "n-1",
    kind: "ANALYSIS_READY",
    title: "✨ Your latest skin analysis is ready",
    description: "Tap to view detailed results and product picks.",
    createdAt: "2025-06-26T09:00:00Z",
    image: "/icons/analysis.png",
    read: true,
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

/** ----------------------------------------------------------------
 *   2. Component
 *  ----------------------------------------------------------------*/
const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const unreadCount = React.useMemo(
    () => mockNotifications.filter((n) => !n.read).length,
    []
  );

  // 🔔 Open / close handlers
  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
     <IconButton
  aria-label="notifications"
  onClick={handleOpen}
  disableRipple
  sx={{
    /* --- base circle size --- */
    width: 44,
    height: 44,
    borderRadius: "50%",

    /* --- default (idle) state --- */
    color: "#757575",                 // medium-grey outline
    bgcolor: "transparent",

    transition: "background-color 0.25s ease, color 0.25s ease",

    /* --- hover / focus-visible --- */
    "&:hover, &:focus-visible": {
      bgcolor: "rgba(255, 105, 180, 0.12)",    // light pink halo
      color: "#FF69B4",                        // primary pink outline
    },

    /* --- keep it pink while popover is open --- */
    ...(Boolean(anchorEl) && {
      bgcolor: "rgba(255, 105, 180, 0.12)",
      color: "#FF69B4",
    }),
  }}
>
  <Badge
    badgeContent={unreadCount}
    color="error"
    overlap="circular"
    sx={{
      "& .MuiBadge-badge": {
        top: 6,
        right: 6,
      },
    }}
  >
    <NotificationsNoneRoundedIcon sx={{ fontSize: 27 }} />
  </Badge>
</IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 360, p: 1 } }}
      >
        <Typography variant="subtitle1" sx={{ px: 2, py: 1 }}>
          Notifications
        </Typography>
        <Divider />

        {mockNotifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              You’re all caught up!
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding sx={{ maxHeight: 400, overflowY: "auto" }}>
            {mockNotifications.map((n) => (
              <ListItem
                key={n.id}
                alignItems="flex-start"
                sx={{
                  bgcolor: n.read ? "transparent" : "#ffeaf6",
                  "&:hover": { bgcolor: "#f8f8f8", cursor: "pointer" },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={n.image}
                    sx={{ bgcolor: "#FF69B4" /* primary color */ }}
                  >
                    {n.title[0]}
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
                      <br />
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
              </ListItem>
            ))}
          </List>
        )}

        <Divider />
        <Box sx={{ p: 1, textAlign: "center" }}>
          <Link to={"/notifications"}> 
          <Button size="small" onClick={handleClose}>
            View all
          </Button>
          </Link>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationBell;

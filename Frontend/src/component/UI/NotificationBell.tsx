import React, { useState } from "react";
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
import { useNavigate, Link } from "react-router-dom";
import { NotificationItem, NotificationKind } from "@/types/NotificationItem";
import useUserStore from "@/store/UserStore";
import useNotificationStore from "@/store/NotificationStore";

// Avatar icon mapping
export const kindAvatars: Partial<Record<NotificationKind, string>> = {
  ANALYSIS_RESULT: "/assets/icons/ANALYSIS_RESULT.png",
  ORDER_STATUS: "/assets/icons/ORDER_STATUS.png",
  ORDER_PLACED: "/assets/icons/ORDER_PLACED.png",
  PROMO: "/assets/icons/PROMO.png",
  ACCOUNT_SUSPENDED: "/assets/icons/ACCOUNT_SUSPENDED.png",
};

const NotificationBell: React.FC = () => {
  const { user } = useUserStore();
  const { notifications, setNotifications } = useNotificationStore();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const unread = notifications.filter(
    (n) => !n.readBy?.some((r) => r.userId === user?._id)
  );
  const read = notifications.filter((n) =>
    n.readBy?.some((r) => r.userId === user?._id)
  );

  const unreadCount = unread.length;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClickNotification = async (notif: NotificationItem) => {
    if (!user) return;
    try {
      const isRead = notif.readBy?.some((r) => r.userId === user?._id);
      if (!isRead) {
        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/notifications/${notif._id}/read`,
          {
            method: "PATCH",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Could not mark notification as read");
        // update locally:
        setNotifications(
          notifications.map((n) =>
            n._id === notif._id
              ? { ...n, readBy: [...(n.readBy || []), { userId: user._id, readAt: new Date().toISOString() }] }
              : n
          )
        );
      }

      if (notif.kind === "ANALYSIS_RESULT" && notif.data?.skinHistoryId) {
        navigate(`/profile-page/analysis-timeline/${notif.data?.skinHistoryId}`);
        handleClose();
      }    if ((notif.kind === "ORDER_PLACED" || notif.kind === "ORDER_STATUS" ) && notif.data?.orderId) {
        navigate(`/profile-page/orders/${notif.data?.orderId}`);
        handleClose();
      }

  
    } catch (err) {
      console.error("❌ Failed to mark notification as read", err);
    }
  };

  return (
    <>
      <IconButton
        aria-label="notifications"
        onClick={handleOpen}
        disableRipple
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          color: "#757575",
          bgcolor: "transparent",
          transition: "background-color 0.25s ease, color 0.25s ease",
          "&:hover, &:focus-visible": {
            bgcolor: "rgba(255, 105, 180, 0.12)",
            color: "#FF69B4",
          },
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
          sx={{ "& .MuiBadge-badge": { top: 6, right: 6 } }}
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

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              You’re all caught up!
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding sx={{ maxHeight: 400, overflowY: "auto" }}>
            {[...unread, ...read].map((n) => (
              <ListItem
                key={n._id}
                alignItems="flex-start"
                onClick={() => handleClickNotification(n)}
                sx={{
                  bgcolor: n.readBy?.some((r) => r.userId === user?._id)
                    ? "transparent"
                    : "#ffeaf6",
                  "&:hover": { bgcolor: "#f8f8f8", cursor: "pointer" },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={n.image || kindAvatars[n.kind]}
                    imgProps={{
                      style: {
                        objectFit: "contain",
                        ...(n.image ? {} : { padding: 6 }),
                      },
                    }}
                    sx={{
                      bgcolor: "#ffa8d3",
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
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {n.body || ""}
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
          <Link to="/notifications">
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

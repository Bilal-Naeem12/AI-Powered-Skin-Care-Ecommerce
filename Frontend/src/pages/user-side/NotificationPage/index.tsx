// src/pages/NotificationsPage.tsx
import React from "react";
import { Container, Typography, Box, IconButton, Tooltip } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import NotificationList from "@/component/UI/NotificationList";
import MainLayout from "@/component/Layout/MainLayout";
import useNotificationStore from "@/store/useNotificationStore";
import useUserStore from "@/store/useUserStore";

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
const { notifications, setNotifications } = useNotificationStore();
const {user } = useUserStore()
  // stub: implement bulk-clear once your API is ready
const handleMarkAllRead = async () => {
  try {
    await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/notifications/mark-all-read`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

   setNotifications(
  notifications.map((n) => {
    const isRead = n.readBy?.some((r) => r.userId === user?._id);
    if (!isRead) {
      return {
        ...n,
        readBy: [
          ...(n.readBy || []),
          {
            userId: user?._id ?? "",
            readAt: new Date().toISOString(), // ✅ Add required field
          },
        ],
      };
    }
    return n;
  })
);

    console.log("✅ All marked as read!");
  } catch (err) {
    console.error("❌ Failed to mark all as read", err);
  }
};
  return (
    <MainLayout>
    <Container maxWidth="lg" className="min-h-screen p-5 rounded shadow-lg bg-white my-5"  sx={{ pt: 3, pb: 6 }}>
      {/* --- header bar --- */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton edge="start" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          All Notifications
        </Typography>
        <Tooltip title="Mark all as read">
          <IconButton onClick={handleMarkAllRead}>
            <DeleteSweepIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <NotificationList />
    </Container></MainLayout>
  );
};

export default NotificationsPage;

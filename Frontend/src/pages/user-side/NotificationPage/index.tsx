// src/pages/NotificationsPage.tsx
import React from "react";
import { Container, Typography, Box, IconButton, Tooltip } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import NotificationList from "@/component/UI/NotificationList";
import MainLayout from "@/component/Layout/MainLayout";

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  // stub: implement bulk-clear once your API is ready
  const handleMarkAllRead = () => {
    console.log("TODO: mark all as read!");
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

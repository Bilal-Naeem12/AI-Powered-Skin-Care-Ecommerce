import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function OrderTrackingPage() {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleSearch = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/orders?q=${query}`,
      { credentials: "include" }
    );
    const data = await res.json();
    setOrders(data.orders || []);
    setSelectedOrder(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Order Tracking
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search by Order #, Email, Name"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      {/* Orders list */}
      {orders.length > 0 && (
        <Paper
          elevation={2}
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: "hidden",
            p: 1,
          }}
        >
          <List>
            {orders.map((order: any) => (
              <ListItemButton
                key={order._id}
                selected={selectedOrder?._id === order._id}
                onClick={() => setSelectedOrder(order)}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={
                      order.cartItems?.[0]?.productId?.images?.[0] ||
                      undefined
                    }
                    alt="Product"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={`Order #${order.orderNumber}`}
                  secondary={`${order.userId?.first_name} ${order.userId?.last_name} | ${order.userId?.email}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}

      {/* Order timeline */}
      {selectedOrder && (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Tracking for Order #{selectedOrder.orderNumber}
          </Typography>

          <Timeline position="right">
            {selectedOrder.statusHistory.map(
              (status: any, index: number) => {
                let icon;
                let color: "primary" | "error" = "primary";
                switch (status.what) {
                  case "Created":
                    icon = <LocalMallIcon fontSize="small" />;
                    break;
                  case "Paid":
                    icon = <LocalShippingIcon fontSize="small" />;
                    break;
                  case "Closed":
                    icon = <ThumbUpIcon fontSize="small" />;
                    break;
                  case "Cancelled":
                    icon = <ThumbUpIcon fontSize="small" />;
                    color = "error";
                    break;
                  default:
                    icon = <DirectionsTransitIcon fontSize="small" />;
                }

                return (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent color="text.secondary">
                      {new Date(status.updatedAt).toLocaleString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={color}>{icon}</TimelineDot>
                      {index < selectedOrder.statusHistory.length - 1 && (
                        <TimelineConnector />
                      )}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography>{status.what}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                );
              }
            )}
          </Timeline>
        </Paper>
      )}
    </Container>
  );
}

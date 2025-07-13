import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RefundRequest } from "@/types/RefundRequest";
import { Order } from "@/types/Order"; // Ensure this exists
import { CartItem } from "@/types/CartItem";

const RefundRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [refund, setRefund] = useState<RefundRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRefund = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/refund-requests/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setRefund(data);
      } catch (err) {
        console.error("Error fetching refund details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRefund();
  }, [id]);

  if (loading) return <Box p={5}><CircularProgress /></Box>;
  if (!refund) return <Typography color="error">Refund request not found.</Typography>;

  const populatedOrder = typeof refund.orderId === "object" && "cartItems" in refund.orderId
    ? (refund.orderId as Order)
    : null;

  return (
    <Container sx={{ mt: 4 }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h4" gutterBottom>
        Refund Request Detail
      </Typography>

      <Chip
        label={refund.status}
        color={
          refund.status === "Approved"
            ? "success"
            : refund.status === "Rejected"
            ? "error"
            : "warning"
        }
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle1">
        <strong>Reason:</strong> {refund.reason}
      </Typography>

      <Typography variant="subtitle2" gutterBottom>
        <strong>Submitted:</strong>{" "}
        {new Date(refund.createdAt).toLocaleDateString()}
      </Typography>

      {refund.details && (
        <Typography sx={{ my: 2 }}>{refund.details}</Typography>
      )}

      {refund.images?.length > 0 && (
        <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
          {refund.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Proof ${i + 1}`}
              style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
            />
          ))}
        </Box>
      )}

      {refund.reviewedBy && (
        <Box mt={3}>
          <Typography variant="body2" color="textSecondary">
            <strong>Reviewed By:</strong> {refund.reviewedBy}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Reviewed At:</strong>{" "}
            {refund.reviewedAt
              ? new Date(refund.reviewedAt).toLocaleString()
              : "N/A"}
          </Typography>
        </Box>
      )}

      {/* --- Order Summary --- */}
      {populatedOrder && (
        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            Order Summary
          </Typography>

          <Typography variant="subtitle2">
            <strong>Order Number:</strong> {populatedOrder.orderNumber}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            <strong>Placed At:</strong>{" "}
            {new Date(populatedOrder.placedAt).toLocaleString()}
          </Typography>

          {populatedOrder.cartItems.map((item:CartItem, idx) => (
            <Box
              key={idx}
              display="flex"
              alignItems="center"
              gap={2}
              sx={{ my: 1, p: 1, border: "1px solid #eee", borderRadius: 2 }}
            >
              <img
                src={item.productId.images[0]}
                alt={item.productId.name}
                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
              />
              <Box>
                <Typography variant="body1">
                  {item.productId.name} (x{item.quantity})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Price: ${item.productId.price.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default RefundRequestDetailPage;

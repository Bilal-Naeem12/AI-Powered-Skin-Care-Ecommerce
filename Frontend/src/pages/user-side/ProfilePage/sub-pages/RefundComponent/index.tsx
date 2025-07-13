import React, { useEffect, useState } from "react";
import { Container, Typography, Box, IconButton, Tooltip, Grid, Paper, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/component/Layout/MainLayout";
import { RefundRequest } from "@/types/RefundRequest";

const RefundRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/refund-requests/user`, {
          credentials: "include",
        });
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch refund requests:", error);
      }
    };
    fetchRefunds();
  }, []);

  return (
    
      <Container maxWidth="lg" className="min-h-screen p-5 rounded shadow-lg bg-white my-5">
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            My Refund Requests
          </Typography>
        </Box>

        {/* Requests */}
        {requests.length === 0 ? (
          <Typography color="textSecondary" align="center" mt={5}>
            You haven't submitted any refund requests yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {requests.map((r) => (
              <Grid item xs={12} md={6} key={r._id}>
                <Paper elevation={3} sx={{ p: 3, borderLeft: `6px solid ${r.status === 'Pending' ? '#f59e0b' : r.status === 'Approved' ? '#10b981' : '#ef4444'}` }}>
                  <Box   onClick={() => navigate(`${r._id}`)} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1"><strong>Reason:</strong> {r.reason}</Typography>
                    <Chip label={r.status} color={r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'error' : 'warning'} />
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Submitted:</strong> {new Date(r.createdAt).toLocaleDateString()}
                  </Typography>
                  {r.details && <Typography variant="body2" sx={{ mb: 1 }}>{r.details}</Typography>}
                  {r.images && r.images.length > 0 && (
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {r.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`proof-${idx}`}
                          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                        />
                      ))}
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    
  );
};

export default RefundRequestsPage;

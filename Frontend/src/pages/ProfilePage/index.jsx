import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Box, Divider } from '@mui/material';

import ProfileHeaderAndInfo from '../../component/UI/ProfileHeaderAndInfo';
import MainLayout from '../../component/Layout/MainLayout';

export default function ProfilePage() {
  
  const [tickets, setTickets] = useState([]); // Store user tickets
  const [loadingTickets, setLoadingTickets] = useState(true); // Loading state for tickets
  const [error, setError] = useState(false);

    const user={
        id:1,
        first_name: "Bilal",
        last_name: "Naeem",
        email: "Bilal@gmail.com",
        city: "Lahore",
        gender: "Male",
        role: "Admin"
    }
  // Fetch user tickets
  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/protected/tickets/user/${user?._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setTickets(data); // Store the tickets in state
        setLoadingTickets(false);
      } catch (error) {
        console.error("Error fetching tickets", error);
        setLoadingTickets(false);
        setError(true);
      }
    };

    fetchUserTickets();
  }, [user?._id]);

 

  return (
    <MainLayout>
    <Box sx={{ maxWidth: '900px', mx: 'auto', mt: 4, p: 2 }}>
      <ProfileHeaderAndInfo
        givenUser={user}
       
      />
      {/* Ticket Preview Section */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Ticket Preview
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {loadingTickets ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="body1">No ticket available to preview</Typography>
        
        ) : (
          <Typography variant="body1">No tickets available.</Typography>
        )}
      </Paper>
    </Box>
    </MainLayout>
  );
}

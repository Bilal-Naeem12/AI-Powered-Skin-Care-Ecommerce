import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Divider, CircularProgress, Button, Grid, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { User } from '@/types/User';
import ProfileHeaderAndInfo from '@/component/UI/ProfileHeaderAndInfo';
import MainLayout from '@/component/Layout/MainLayout';
import useFetchAuthData from '@/hooks/useFetchAuthData';
import useUserStore from '@/store/useUserStore';

const ProfileComponent: React.FC = () => {

 
 const {user } = useUserStore()




  return (

      <Box sx={{ maxWidth: '900px', mt: 0, p: 2 }}>
        {/* Profile Info Section */}
        <Box sx={{ padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  alt={user?.first_name}
                  src={user?.profileImage || '/assets/default-profile.png'}
                  sx={{ width: 120, height: 120 }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography variant="h5">{user?.first_name} {user?.last_name}</Typography>
              <Typography variant="body1" color="textSecondary">{user?.email}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {user?.phone || 'Phone not provided'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {user?.address?.street}, {user?.address?.city}, {user?.address?.state}, {user?.address?.country}
              </Typography>
            </Grid>
          </Grid>

          {/* Skin Concerns Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Skin Concerns</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {user?.skin_concerns.length ? (
                user.skin_concerns.map((concern, index) => (
                  <Chip label={concern} key={index} color="primary" />
                ))
              ) : (
                <Typography variant="body2">No skin concerns listed.</Typography>
              )}
            </Box>
          </Box>

          {/* Lifestyle Factors */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Lifestyle Factors</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">Smoking: {user?.lifestyle_factors.smoking ? 'Yes' : 'No'}</Typography>
            <Typography variant="body1">Alcohol Consumption: {user?.lifestyle_factors.alcohol_consumption ? 'Yes' : 'No'}</Typography>
            <Typography variant="body1">Diet: {user?.lifestyle_factors.diet}</Typography>
          </Box>

        </Box>
      </Box>

  );
};

export default ProfileComponent;

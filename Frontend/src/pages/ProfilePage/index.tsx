import React from 'react';
import { Paper, Typography, CircularProgress, Box, Divider, Avatar, Grid, Button, Chip } from '@mui/material';
import { User } from '@/types/User';
import ProfileHeaderAndInfo from '../../component/UI/ProfileHeaderAndInfo';
import MainLayout from '../../component/Layout/MainLayout';
import { styled } from '@mui/system';
import useFetchAuthData from '@/hooks/useFetchAuthData'; // adjust path as needed

const StyledPaper = styled(Paper)({
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

const ProfilePage = () => {
  const { data: user, loading, error } = useFetchAuthData<User>(
    `${import.meta.env.VITE_API_BACKEND_URL}/users/profile`
  );

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="error">
            Something went wrong. Please try again later.
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ maxWidth: '900px', mx: 'auto', mt: 4, p: 2 }}>
        {/* Profile Header */}
        <ProfileHeaderAndInfo givenUser={user} />

        {/* Profile Info Section */}
        <StyledPaper elevation={3}>
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
                {user?.phone}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {user?.address?.street}, {user?.address?.city}, {user?.address?.state}, {user?.address?.country}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Skin Concerns</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {user?.skin_concerns.length ? (
                user?.skin_concerns.map((concern, index) => (
                  <Chip label={concern} key={index} color="primary" />
                ))
              ) : (
                <Typography variant="body2">No skin concerns listed.</Typography>
              )}
            </Box>

            <Typography variant="h6" sx={{ mt: 4 }}>
              Lifestyle Factors
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">Smoking: {user?.lifestyle_factors.smoking ? 'Yes' : 'No'}</Typography>
            <Typography variant="body1">Alcohol Consumption: {user?.lifestyle_factors.alcohol_consumption ? 'Yes' : 'No'}</Typography>
            <Typography variant="body1">Diet: {user?.lifestyle_factors.diet}</Typography>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={() => console.log('Edit Profile clicked')}>
              Edit Profile
            </Button>
          </Box>
        </StyledPaper>

        
      </Box>
    </MainLayout>
  );
};

export default ProfilePage;

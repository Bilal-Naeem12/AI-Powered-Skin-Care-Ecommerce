
import MainLayout from '@/component/Layout/MainLayout';
import SidebarComponent from '@/component/Layout/Sidebar';
import {profileSidebarOptions, SidebarOption} from '@/data/profileSidebarOptions';
import useFetchAuthData from '@/hooks/useFetchAuthData';
import { User } from '@/types/User';
import { Box, CircularProgress, Typography } from '@mui/material';

import { Navigate, Route, Routes } from 'react-router-dom';
import ProductReviewPage from './sub-pages/OrdersComponent/sub-pages/LeaveReview/ProductReviewPage';
import OrderDetailPage from './sub-pages/OrdersComponent/sub-pages/OrderDetail';
import AnalysisDetail from './sub-pages/SkinAnalysisTimeline/AnalysisDetail';
import RefundRequestDetailPage from './sub-pages/RefundComponent/RefundRequestDetailPage';

const ProfilePage = () => {
 
// Recursive function to flatten all routes, including sub-options
const flattenRoutes = (options: SidebarOption[]): SidebarOption[] => {
  const flatRoutes: SidebarOption[] = [];

  options.forEach((option) => {
    flatRoutes.push(option); // Add the main option

    // If sub-options exist, recursively flatten them
    if (option.subOptions) {
      flatRoutes.push(...flattenRoutes(option.subOptions));
    }
  });

  return flatRoutes;
};
const { data: user, loading, error } = useFetchAuthData<User>(
  `${import.meta.env.VITE_API_BACKEND_URL}/users/profile`
);
if (loading) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}
const allRoutes = flattenRoutes(profileSidebarOptions.flatMap((section) => section.options));
if (error || !user) {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h6" color="error">
        Something went wrong. Please try again later.
      </Typography>
    </Box>
  );
}
  return (
    <MainLayout>
      <div className="flex grow ">
    <SidebarComponent sidebarOptions={profileSidebarOptions}/>
    <div className="grow p-4 bg-gray-100 overflow-auto min-h-screen">
  <Routes>

    {/* Render all routes */}
    {allRoutes.map((route) => (
      <Route key={route.path} path={route.path.replace("/profile-page", "")} element={<route.component />} />
    ))}

 <Route path="/orders/:id" element={<OrderDetailPage />} />
  <Route path="/analysis-timeline/:id" element={<AnalysisDetail />} />
  <Route path="/progress-tracking/:id" element={<AnalysisDetail />} />
  <Route path="/refund-requests/:id" element={<RefundRequestDetailPage />} />

     {/* <Route path="/order/product/:id" element={<ProductReviewPage/>} /> */}

  {/* Default Route */}
  <Route path="/" element={<Navigate to="/profile-page/my-profile" />} />

  </Routes>
</div>
    </div>
    </MainLayout>

  );
};

export default ProfilePage;

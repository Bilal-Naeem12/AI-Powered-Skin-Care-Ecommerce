// src/router/AdminRouter.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";

import AdminDashboard from "@/pages/admin-side/AdminDashboard";
import AdminNotFound from "@/pages/admin-side/AdminNotFound";
import ManageOrders from "@/pages/admin-side/Orders & Payments/ManageOrders";
import ManageProducts from "@/pages/admin-side/Products/ManageProducts";
import ManageUsers from "@/pages/admin-side/Users/ManageUsers";
import SiteSettings from "@/pages/admin-side/SiteSettings";


import { HelmetProvider } from "react-helmet-async";
import AppLayout from "@/pages/admin-side/AdminLayout/AppLayout";


import { AppWrapper } from "@/component/common/PageMeta.js";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/index.css"

import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import AdminProfile from "@/pages/admin-side/Users/AdminProfile";
import DeletedUsers from "@/pages/admin-side/Users/DeletedUsers";
import ManageCategories from "@/pages/admin-side/Products/ManageCategories";

const AdminRouter: React.FC = () => {

  return (
    <ThemeProvider>
      <AppWrapper>
    <HelmetProvider>
    <Routes>
     
    <Route element={<AppLayout />}>
          <Route index element={<AdminDashboard />} />
             {/* Others Page */}
             <Route path="/profile" element={<AdminProfile />} />
            {/* <Route path="/calendar" element={<Calendar />} /> */}
      
          <Route path="users" element={<ManageUsers />} />
          <Route path="/users/deleted" element={<DeletedUsers />} />

 


          <Route path="products" element={<ManageProducts />} />
          <Route path="products/categories" element={<ManageCategories />} />


          <Route path="orders" element={<ManageOrders />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="*" element={<AdminNotFound />} />
        
          </Route>

    </Routes>
    </HelmetProvider>
    </AppWrapper>
    </ThemeProvider>
  );
};

export default AdminRouter;

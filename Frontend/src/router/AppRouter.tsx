import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Home from "../pages/user-side/Home";
import Login from "../pages/user-side/Login";
import SignupPage from "../pages/user-side/Signup";
import CartPage from "../pages/user-side/CartPage";
import CheckoutPage from "../pages/user-side/CheckoutPage";
import AnalyzePage from "../pages/user-side/AnalyzePage";
import ContactUsPage from "../pages/user-side/ContactUsPage";
import NotFound from "../pages/404"; // Import the NotFound component
import ShopPage from "../pages/user-side/ShopPage";
import ProductDetailPage from "../pages/user-side/ProductDetailPage";
import AboutUsPage from "../pages/user-side/AboutUsPage";
import ProfilePage from "../pages/user-side/ProfilePage";
import TestPage from "../pages/Test";
import InpaitingTestPage from "../pages/Test/InpaitingTest";
import ResetPasswordPageWrapper from "@/pages/user-side/ResetPasswordPage/ResetPasswordPageWrapper";
import ForgotPasswordFormPage from "@/pages/user-side/ForgetPassword";
import ProductImageUploader from "@/component/UI/ProductImageUploader";
import AdminRouter from "./AdminRouter";
import useUserStore from "@/store/useUserStore";
import AcneSeverityTestPage from "@/pages/Test/acneSeverityTest";
import SkinTypeTestPage from "@/pages/Test/skinTypeTest";
import SkinAnalysisTestPage from "@/pages/Test/skinAnalysisTestPage";
import FaceScanResultPage from "@/pages/user-side/AnalyzePage/subpages/FaceScanResult";
import InpaintingPage from "@/pages/user-side/AnalyzePage/subpages/InpaintingPage/InpaintingPage";
import MobileScan from "@/pages/user-side/FaceScanModal/MobileScan";


const RedirectIfAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useUserStore();
  const location = useLocation();

  if (isAdmin && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};


const AppRouter: React.FC = () => {
  

  return (
    <Router>
        <RedirectIfAdmin>
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart-page" element={<CartPage />} />
        <Route path="/checkout-page" element={<CheckoutPage />} />
        <Route path="/ai-tools-page" element={<AnalyzePage />} />
        <Route path="/ai-tools-page/skin-analysis" element={<FaceScanResultPage />} />
        <Route path="/ai-tools-page/inpainting" element={<InpaintingPage />} />
    <Route path="/mobile-scan/:sessionId" element={<MobileScan />} />

        <Route path="/contact-us-page" element={<ContactUsPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/profile-page/*" element={<ProfilePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/testIn" element={<InpaitingTestPage />} />
        <Route path="/test-acne-severity" element={< AcneSeverityTestPage/>} />
        <Route path="/test-skin-type" element={< SkinTypeTestPage/>} />
        <Route path="/test-skin-analysis" element={< SkinAnalysisTestPage/>} />

        <Route path="/forget-password" element={<ForgotPasswordFormPage />} />
        <Route
          path="/reset-password/:token" // Token is passed as a URL parameter
          element={<ResetPasswordPageWrapper />} // Render the ResetPasswordPage
        />
            <Route
          path="/product/upload-images" // Token is passed as a URL parameter
          element={<ProductImageUploader />} // Render the ResetPasswordPage
        />

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </RedirectIfAdmin>
    </Router>
  );
};

export default AppRouter;

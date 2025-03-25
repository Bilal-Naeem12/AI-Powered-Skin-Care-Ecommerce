import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignupPage from "../pages/Signup";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import AnalyzePage from "../pages/AnalyzePage";
import ContactUsPage from "../pages/ContactUsPage";
import NotFound from "../pages/404"; // Import the NotFound component
import ShopPage from "../pages/ShopPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import AboutUsPage from "../pages/AboutUsPage";
import ProfilePage from "../pages/ProfilePage";
import TestPage from "../pages/test";
import InpaitingTestPage from "../pages/Test/InpaitingTest";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart-page" element={<CartPage />} />
        <Route path="/checkout-page" element={<CheckoutPage />} />
        <Route path="/analyze-page" element={<AnalyzePage />} />
        <Route path="/contact-us-page" element={<ContactUsPage />} />
        <Route path="/shop" element={<ShopPage/>} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/test" element={<InpaitingTestPage />} />
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

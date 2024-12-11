import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignupPage from "../pages/Signup";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import AnalyzePage from "../pages/AnalyzePage";
import ContactUsPage from "../pages/ContactUsPage";

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
      </Routes>
    </Router>
  );
};

export default AppRouter;

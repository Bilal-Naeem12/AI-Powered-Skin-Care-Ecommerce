import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ResetPasswordPage from "./index";
import MainLayout from "@/component/Layout/MainLayout";

const ResetPasswordPageWrapper: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Retrieve the token from the URL

  if (!token) {
    return <div>Error: Invalid reset token</div>;
  }

  return   <ResetPasswordPage token={token} />;
};

export default ResetPasswordPageWrapper;

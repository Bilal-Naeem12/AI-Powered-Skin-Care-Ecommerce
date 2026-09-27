import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "@/store/UserStore"; // Import the UserStore
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const usePutAuthData = <T,>(url: string, data: T, reloadTrigger?: boolean) => {
  const [responseData, setResponseData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { logout } = useUserStore(); // Access logout function from UserStore
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const updateData = async () => {
      setLoading(true);
      setError(null);
      setResponseData(null);

      const tryRequest = () => {
        return axios.put<any>(url, data, {
          withCredentials: true, // Send cookies including HTTP-only tokens
        });
      };

      try {
        const response = await tryRequest();
        if (active) setResponseData(response.data);
      } catch (err: any) {
        if (!active) return;
        if (err.response?.status === 403) {
          try {
            // Attempt to refresh access token using the refresh token (HTTP-only cookie)
            await axios.post(
              `${import.meta.env.VITE_API_BACKEND_URL}/users/refresh-token`,
              {},
              { withCredentials: true }
            );

            // Retry original request after refreshing
            const retryResponse = await tryRequest();
            if (active) setResponseData(retryResponse.data);
          } catch (refreshError) {
            if (!active) return;
            console.error("Refresh token failed:", refreshError);
            setError("Session expired. Please log in again.");
            // Logout the user by updating the UserStore and removing from localStorage
            logout(); // Call the logout action to reset the store
            toast.error("Session expired. Please log in again.");
            navigate("/"); // Redirect to login page
          }
        } else {
          console.error("API error:", err);
          setError("Failed to update data.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (data && url) {
      updateData();
    }
    return () => { active = false; };
  }, [url, data, reloadTrigger, logout, navigate]); // Adding logout to the dependency array

  return { responseData, loading, error };
};

export default usePutAuthData;

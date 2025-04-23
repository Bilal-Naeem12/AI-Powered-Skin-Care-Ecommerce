import { useState, useEffect } from "react";
import axios from "axios";

const useFetchAuthData = <T,>(url: string, reloadTrigger?: boolean) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const tryRequest = () => {
        return axios.get<T>(url, {
          withCredentials: true, // Send cookies including HTTP-only tokens
        });
      };

      try {
        const response = await tryRequest();
        setData(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          try {
            // Attempt to refresh access token using the refresh token (HTTP-only cookie)
            await axios.post(
              `${import.meta.env.VITE_API_BACKEND_URL}/users/refresh-token`,
              {},
              { withCredentials: true }
            );

            // Retry original request after refreshing
            const retryResponse = await tryRequest();
            setData(retryResponse.data);
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            setError("Session expired. Please log in again.");
          }
        } else {
          console.error("API error:", err);
          setError("Failed to fetch data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, reloadTrigger]);

  return { data, loading, error };
};

export default useFetchAuthData;

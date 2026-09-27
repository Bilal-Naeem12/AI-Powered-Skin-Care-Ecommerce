import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "@/store/UserStore";
import { useNavigate } from "react-router-dom";

const usePostAuthData = <T, R>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { logout } = useUserStore();
  const navigate = useNavigate();

  const postData = async (url: string, payload: R  ,successMessage?: string ) => {
    setLoading(true);
    setError(null);

    const tryRequest = () =>
      axios.post<T>(url, payload, { withCredentials: true });

    try {
      const response = await tryRequest();
      setData(response.data);
         if (successMessage) toast.success(successMessage);
      return { ok: true as const, data: response.data };
    } catch (err: any) {
      if (err.response?.status === 403) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_BACKEND_URL}/users/refresh-token`,
            {},
            { withCredentials: true }
          );
          const retryResponse = await tryRequest();
          setData(retryResponse.data);
          if (successMessage) toast.success(successMessage);
          return { ok: true as const, data: retryResponse.data };
        } catch (refreshErr) {
          console.error("🔒 Token refresh failed:", refreshErr);
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/");
        }
      } else if (err.response?.status === 429) {
        setError("Too many requests. Please wait a moment.");
        toast.error("You're doing that too much! Try again in a few seconds.");
      } else {
        console.error("🔴 Request failed:", err);
        setError("Failed to fetch recommendation.");
      toast.error(  err.response?.data?.message ||"Something went wrong while fetching data.");
      }
    } finally {
      setLoading(false);
    }
    return { ok: false as const };
  };

  return { data, loading, error, postData };
};

export default usePostAuthData;

// src/hooks/useDeleteAuthData.ts
import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/UserStore";

export function useDeleteAuthData() {
  const [loading, setLoading] = useState(false);
  const { logout } = useUserStore();          // store action
  const navigate = useNavigate();

  /* ---------------------------------------------------------------
     Main helper that always sends withCredentials
  ---------------------------------------------------------------- */
  const sendDelete = (url: string) =>
    axios.delete(url, { withCredentials: true });

  /* ---------------------------------------------------------------
     Public API
  ---------------------------------------------------------------- */
  const onDelete = useCallback(
    async (apiUrl: string, id: string | number) => {
      setLoading(true);
      const fullUrl = `${apiUrl}/${id}`;

      try {
        await sendDelete(fullUrl);
        toast.success("Delete successful!");
      } catch (err: any) {
        /* ---------- expired access token? try refresh ---------- */
        if (err.response?.status === 403) {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_BACKEND_URL}/users/refresh-token`,
              {},
              { withCredentials: true }
            );
            /* retry once after refresh */
            await sendDelete(fullUrl);
            toast.success("Delete successful!");
          } catch (refreshErr) {
            console.error("Refresh token failed:", refreshErr);
            toast.error("Session expired. Please log in again.");
            logout();
            navigate("/");
          }
        } else {
          console.error(
            "Delete error:",
            err.response?.data || err.message
          );
          toast.error(
            `Delete failed: ${
              err.response?.data?.message || err.message
            }`
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [logout, navigate]
  );

  return { onDelete, loading };
}

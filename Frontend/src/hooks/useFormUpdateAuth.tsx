// src/hooks/useFormUpdateAuth.ts
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/useUserStore";

export function useFormUpdateAuth(apiUrl: string, onSuccess?: () => void) {
  const navigate = useNavigate();
  const { logout, setUser } = useUserStore();

  return async <T>(values: T) => {
    try {
      const { data } = await axios.put(apiUrl, values, {
        withCredentials: true,
      });
      toast.success("Profile updated");
      setUser(data.user);            // refresh Pinia/Zustand store
      onSuccess?.();
    } catch (err: any) {
      if (err.response?.status === 403) {
        // refresh cookie, retry OR force logout (reuse logic from useFetchAuthData)
        navigate("/");
        logout();
      }
      toast.error(
        err.response?.data?.message || "Update failed, try again."
      );
    }
  };
}

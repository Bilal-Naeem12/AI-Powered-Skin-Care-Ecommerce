import { create } from 'zustand';
import axios from "axios";
type AuthState = {
  isRefreshTokenValid: boolean;
  setRefreshTokenValid: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isRefreshTokenValid: true,
  setRefreshTokenValid: (value) => set({ isRefreshTokenValid: value }),
}));

export const checkRefreshToken = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BACKEND_URL}/users/check-refresh-token`, { withCredentials: true });
    useAuthStore.getState().setRefreshTokenValid(res.data.valid);
  } catch (e) {
    useAuthStore.getState().setRefreshTokenValid(false);
  }
};

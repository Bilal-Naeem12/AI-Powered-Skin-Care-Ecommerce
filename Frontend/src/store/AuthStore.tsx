import { create } from 'zustand';
import axios from "axios";
import useUserStore from './UserStore';
type AuthState = {
  isRefreshTokenValid: boolean|undefined;
    isCheckingToken: boolean;
    setCheckingToken: (value: boolean) => void;
  setRefreshTokenValid: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isRefreshTokenValid: undefined,
   isCheckingToken: true,
   setRefreshTokenValid: (value) => set({ isRefreshTokenValid: value, isCheckingToken: false }),
    setCheckingToken: (value) => set({ isCheckingToken: value }),
}));

export const checkRefreshToken = async () => {
  const { setRefreshTokenValid, setCheckingToken } = useAuthStore.getState();
  const { logout } = useUserStore.getState();

  setCheckingToken(true);

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BACKEND_URL}/users/check-refresh-token`, {
      withCredentials: true,
    });

    if (res.data.valid) {
      setRefreshTokenValid(true);
    } else {
      logout(false);
    }
  } catch (e) {
    logout(false);
  }
};
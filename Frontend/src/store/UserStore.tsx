import useSkinAnalysisStore from './SkinAnalysis';
import useInpaintingStore from './InpaintingStore';
import useRecommendationStore from './RecommendationStore';
import useSocketStore from './SocketStore';
import useFaceScanStore from './FaceScanStore';
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "@/types/User";
import { toast } from "react-toastify";
import useNotificationStore from "./NotificationStore"; // ✅ import the store

// Define the store state type
interface UserStore {
  user: User | null;           // Logged in user object
  isLoggedIn: boolean;         // Whether user is logged in
  isAdmin: boolean;    
    loading: boolean; // ✅ NEW   
    isFirstLogin: boolean;      // Whether user is admin
   setUser: (user: User, isFirstLogin?: boolean) => void; 
  logout: (showtoast?: boolean) => void;
  checkLogin: () => void;
}

const useUserStore = create<UserStore>()(
  devtools((set, get) => ({
    user: null,
    isLoggedIn: false,
    isAdmin: false,
    isFirstLogin: false,
    loading: true, // ✅ start with true

  setUser: (user: User, isFirstLogin = false) => {
      const isAdmin = user.role === "admin";
      set({ user, isLoggedIn: true, isAdmin, isFirstLogin, loading: false });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isFirstLogin", JSON.stringify(isFirstLogin));
    },

    logout: (showtoast = true) => {
     if (showtoast) toast.success("Logout");
      set({ user: null, isLoggedIn: false, isAdmin: false, isFirstLogin: false, loading: false });
      localStorage.removeItem("isFirstLogin");
      localStorage.removeItem("walkThroughInProgress");
      localStorage.removeItem("user"); 
        useNotificationStore.getState().clearNotifications();
        useSkinAnalysisStore.getState().clearResult();
        useInpaintingStore.getState().clear();
        useRecommendationStore.getState().clearData();
        useSocketStore.getState().disconnectSocket();
        useFaceScanStore.getState().closeModal();
        useFaceScanStore.getState().resetCapturedImage();
    },

  checkLogin: () => {
      const userString = localStorage.getItem("user");
      if (userString) {
        let user: User;
        try {
          user = JSON.parse(userString) as User;
          if (!user || typeof user._id !== "string") throw new Error("Invalid cached user");
        } catch {
          get().logout(false);
          return;
        }
        const isAdmin = user.role === "admin";
        set({ user, isLoggedIn: true, isAdmin, loading: false });
      } else {
        set({ loading: false }); // ❗Don't forget this
      }
    },
 }))
);

export default useUserStore;

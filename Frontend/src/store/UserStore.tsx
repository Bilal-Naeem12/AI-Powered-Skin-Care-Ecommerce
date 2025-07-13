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
    loading: true, // ✅ start with true

  setUser: (user: User, isFirstLogin = false) => {
      const isAdmin = user.role === "admin";
      set({ user, isLoggedIn: true, isAdmin, isFirstLogin });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isFirstLogin", JSON.stringify(isFirstLogin));
    },

    logout: (showtoast = true) => {
     showtoast&& toast.success("Logout");
      set({ user: null, isLoggedIn: false, isAdmin: false });
      localStorage.removeItem("user"); 
        useNotificationStore.getState().clearNotifications();
    },

  checkLogin: () => {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString) as User;
        const isAdmin = user.role === "admin";
        set({ user, isLoggedIn: true, isAdmin, loading: false });
      } else {
        set({ loading: false }); // ❗Don't forget this
      }
    },
 }))
);

export default useUserStore;

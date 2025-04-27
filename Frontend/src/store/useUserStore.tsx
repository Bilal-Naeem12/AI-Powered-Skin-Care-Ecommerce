import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "@/types/User";
import { toast } from "react-toastify";

// Define the store state type
interface UserStore {
  user: User | null;           // Logged in user object
  isLoggedIn: boolean;         // Whether user is logged in
  isAdmin: boolean;            // Whether user is admin
  setUser: (user: User) => void;
  logout: () => void;
  checkLogin: () => void;
}

const useUserStore = create<UserStore>()(
  devtools((set, get) => ({
    user: null,
    isLoggedIn: false,
    isAdmin: false,

    setUser: (user: User) => {
      const isAdmin = user.role === "admin";
      set({ user, isLoggedIn: true, isAdmin });
      localStorage.setItem("user", JSON.stringify(user)); // Save user in localStorage
    },

    logout: () => {
      set({ user: null, isLoggedIn: false, isAdmin: false });
      localStorage.removeItem("user"); 
    },

    checkLogin: () => {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString) as User;
        const isAdmin = user.role === "admin";
        set({ user, isLoggedIn: true, isAdmin });
      }
    },
  }))
);

export default useUserStore;

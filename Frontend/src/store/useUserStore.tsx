import { create } from "zustand";
import { devtools } from "zustand/middleware"; // Import devtools middleware
import { User } from "@/types/User"; // Assuming you have a User type defined
import { toast } from "react-toastify"; // For toast notifications

// Define the store state type
interface UserStore {
  user: User | null; // The user object or null if no user is logged in
  isLoggedIn: boolean; // Boolean for the login status
  setUser: (user: User) => void; // Set user after login
  logout: () => void; // Logout the user and clear the store
  checkLogin: () => void; // Check if user is logged in based on localStorage
}

const useUserStore = create<UserStore>()(
  devtools((set, get) => ({
    user: null,
    isLoggedIn: false,
    setUser: (user: User) => {
      set({ user, isLoggedIn: true });
      localStorage.setItem("user", JSON.stringify(user)); // Save to localStorage
    },
    logout: () => {
      set({ user: null, isLoggedIn: false });
      localStorage.removeItem("user"); 
    },
    checkLogin: () => {
      const user = localStorage.getItem("user");
      if (user) {
        set({ user: JSON.parse(user), isLoggedIn: true });
      }
    },
  }))
);

export default useUserStore;

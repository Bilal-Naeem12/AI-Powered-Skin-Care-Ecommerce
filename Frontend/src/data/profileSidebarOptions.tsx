
import AccountSettingsComponent from "@/pages/user-side/ProfilePage/sub-pages/AccountSettingsComponent";
import BreakoutAnalyzerComponent from "@/pages/user-side/ProfilePage/sub-pages/BreakoutAnalyzerComponent";
import FAQComponent from "@/pages/user-side/ProfilePage/sub-pages/FAQComponent";
import LogoutComponent from "@/pages/user-side/ProfilePage/sub-pages/LogoutComponent";
import OrdersComponent from "@/pages/user-side/ProfilePage/sub-pages/OrdersComponent";
import ProfileComponent from "@/pages/user-side/ProfilePage/sub-pages/ProfileComponent";
import ReferAFriendComponent from "@/pages/user-side/ProfilePage/sub-pages/ReferAFriendComponent";
import RewardsComponent from "@/pages/user-side/ProfilePage/sub-pages/RewardsComponent";
import SettingsComponent from "@/pages/user-side/ProfilePage/sub-pages/SettingsComponent";
import SkinRoutineComponent from "@/pages/user-side/ProfilePage/sub-pages/SkinRoutineComponent";
import UserManagementComponent from "@/pages/user-side/ProfilePage/sub-pages/UserManagementComponent";
import {
    Home,
    User,
    Settings,
    Calendar,
    FileText,
    DollarSign,
    Briefcase,
    Clipboard,
    Layers,
    Building,
    Shield,
    HelpCircle,
    TicketIcon,
    MapPin,
    Mail,
  } from "lucide-react";
  
 
  
  // Type definition for a single route option
  export interface SidebarOption {
    name: string;
    path: string;
    icon?: React.ElementType; // Correctly typed using LucideIcon
    component: React.FC<any>; // Allow components with any props
    subOptions?: SidebarOption[]; // Optional sub-options
  }
  
  // Type definition for sections in the sidebar
  export interface SidebarSection {
    section: string;
    options: SidebarOption[];
  }
  
  export const profileSidebarOptions: SidebarSection[] = [
    {
      section: "Profile",
      options: [
        {
          name: "My Profile",
          path: "/profile-page",
          icon: User,
          component: ProfileComponent,
        },
        {
          name: "Setting",
          path: "/profile-page/settings",
          icon: Settings,
          component: SettingsComponent,
        },
        {
          name: "Log out",
          path: "/profile-page/logout",
          icon: HelpCircle,
          component: LogoutComponent,
        },
      ],
    },
    {
      section: "Account",
      options: [
        // {
        //   name: "Account Overview",
        //   path: "/profile-page/account-overview",
        //   icon: User,
        //   component: ProfileComponent,
        // },
        {
          name: "My Skin Routine",
          path: "/profile-page/skin-routine", // Path for Skin Routine
          icon: Calendar, // Use a relevant icon for skin routine
          component: SkinRoutineComponent, // Define SkinRoutineComponent
        },
        {
          name: "My Orders",
          path: "/profile-page/orders",
          icon: FileText,
          component: OrdersComponent, // Define OrdersComponent
        },
        {
          name: "My Rewards",
          path: "/profile-page/rewards",
          icon: DollarSign,
          component: RewardsComponent, // Define RewardsComponent
        },
        {
          name: "Breakout Analyzer",
          path: "/profile-page/breakout-analyzer",
          icon: Layers,
          component: BreakoutAnalyzerComponent, // Define BreakoutAnalyzerComponent
        },
        {
          name: "Account Settings",
          path: "/profile-page/account-settings",
          icon: Settings,
          component: AccountSettingsComponent, // Define AccountSettingsComponent
        },
        {
          name: "FAQs",
          path: "/profile-page/faqs",
          icon: HelpCircle,
          component: FAQComponent, // Define FAQComponent
        },
        {
          name: "Refer a Friend",
          path: "/profile-page/refer-a-friend",
          icon: Clipboard,
          component: ReferAFriendComponent, // Define ReferAFriendComponent
        },
       
      ],
    },
    // {
    //   section: "Security",
    //   options: [
    //     {
    //       name: "User Management",
    //       path: "/profile-page/user-management",
    //       icon: User,
    //       component: UserManagementComponent, // Define UserManagementComponent
    //     },
    //   ],
    // },
    // Add additional sections as necessary
  ];
  
  
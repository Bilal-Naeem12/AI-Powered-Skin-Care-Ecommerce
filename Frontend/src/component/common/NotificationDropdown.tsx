import { useEffect, useState } from "react";
import { Dropdown } from "@/component/admin/Dropdown";
import { DropdownItem } from "@/component/admin/DropdownItem";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { kindAvatars } from "../UI/NotificationBell";
import { NotificationItem, NotificationKind } from "@/types/NotificationItem";
import useNotificationSocket from "@/hooks/useNotificationSocket";
import useNotificationStore from "@/store/NotificationStore";
import useUserStore from "@/store/UserStore";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
    const { user } = useUserStore();
   const { notifications, setNotifications } = useNotificationStore();
  const navigate = useNavigate();
 const kindAvatars: Partial<Record<NotificationKind, string>> = {
  MANAGEMENT_ORDER_PLACED: "/assets/icons/ORDER_PLACED.png",
  MANAGEMENT_REFUND_REQUEST:"/assets/icons/MANAGEMENT_REFUND_REQUEST.png",
    CONTACT_MESSAGE:"/assets/icons/CONTACT_MESSAGE.png",
    NEW_USER:"/assets/icons/NEW_USER.png",
};
  // Fetch only MANAGEMENT_ORDER_PLACED notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get<NotificationItem[]>(
        `${import.meta.env.VITE_API_BACKEND_URL}/notifications`,
        { withCredentials: true }
      );
       const allowedKinds = ["MANAGEMENT_ORDER_PLACED", "MANAGEMENT_REFUND_REQUEST", "CONTACT_MESSAGE","NEW_USER"];

const filtered = res.data.filter(n => allowedKinds.includes(n.kind));
      setNotifications(filtered.slice(0, 30));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

   useEffect(() => {
    setNotifying(true)
  }, [notifications]);
  
  const handleClick = () => {
    setIsOpen(!isOpen);
    setNotifying(false); // Clear ping dot
  };

  const handleItemClick =async (notif: NotificationItem) => {
     try {
      const isRead = notif.readBy?.some((r) => r.userId === user?._id);
      if (!isRead) {
        await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/notifications/${notif._id}/read`,
          {
            method: "PATCH",
            credentials: "include",
          }
        );
        // update locally:
        setNotifications(
          notifications.map((n) =>
            n._id === notif._id
              ? { ...n, readBy: [...(n.readBy || []), { userId: user._id }] }
              : n
          )
        );
      }
    
    setIsOpen(false);
    if (notif.kind === "MANAGEMENT_ORDER_PLACED" && notif.data?.orderId) {
      navigate(`/admin/orders`);
    } 
    if (notif.kind === "MANAGEMENT_REFUND_REQUEST" && notif.data?.orderId) {
      navigate(`/admin/orders`);
    }
      if (notif.kind === "CONTACT_MESSAGE" ) {
      navigate(`/admin/contact-messages`);
    }
  if (notif.kind === "NEW_USER" ) {
      navigate(`/admin/users`);
    }


  
  
  
  }catch (err) {
      console.error("❌ Failed to mark notification as read", err);
    }
    };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
          />
        </svg>
      </button>

      {/* Dropdown */}
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute -right-[240px] mt-[17px] flex max-h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h5>
          <button onClick={handleClick} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifications?.length > 0 ? (
            notifications.map((n) => (
              <li key={n._id}>
                <DropdownItem
                  onItemClick={() => handleItemClick(n)}
                  className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
                  <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                    <img
                      width={40}
                      height={40}
                      src={n.image || kindAvatars[n.kind]}
                      alt="icon"
                      className="w-full overflow-hidden rounded-full"
                      style={{
                        objectFit: "contain",
                        padding: n.image ? 0 : 6,
                      }}
                    />
                  </span>
                  <span className="block">
                    <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">{n.title}</span>
                      {n.body && <span> — {n.body}</span>}
                    </span>
                    <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                      <span>{n.kind.replace(/_/g, " ")}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</span>
                    </span>
                  </span>
                </DropdownItem>
              </li>
            ))
          ) : (
            <li className="text-center py-4 text-gray-500 dark:text-gray-400">No notifications yet.</li>
          )}
        </ul>

        <Link
          to="/admin/notifications"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}

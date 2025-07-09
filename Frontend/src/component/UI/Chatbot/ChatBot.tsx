import { useEffect, useRef } from "react";
import ChatBot from "react-chatbotify";
import { motion, AnimatePresence } from "framer-motion";
import "./Theme/styles.css";
import { getChatbotSettings } from "./Theme/settings";
import { chatbotCustomStyles } from "./Theme/styles";
import { chatbotFlow } from "./chatbotFlow";
import useUserStore from "@/store/UserStore";
import { useChatbotStore } from "@/store/ChatbotStore";
import { is } from "date-fns/locale";

export const ChatBotUI = () => {
  const { user, isLoggedIn } = useUserStore();
  const { isOpen, closeChatbot } = useChatbotStore();
  const chatbotRef = useRef<HTMLDivElement>(null);

  const chatbotKey = isLoggedIn ? user?._id ?? "loggedIn" : "guest";
  const chatbotSettings = getChatbotSettings(isLoggedIn ? user : null);

 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (!isOpen) return;

    const target = event.target as HTMLElement;

    const isInsideChatbot =
      chatbotRef.current?.contains(target) ||
      target.closest(".rcb") !== null; // Covers overlays/tooltips

    if (!isInsideChatbot) {
      closeChatbot();
    }
  };

  document.addEventListener("click", handleClickOutside, true); // ✅ Use capture phase

  return () => {
    document.removeEventListener("click", handleClickOutside, true);
  };
}, [isOpen, closeChatbot]);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={chatbotRef}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            zIndex: 9999,
            maxWidth: "380px",
            width: "100%",
          }}
        >
          <ChatBot
            key={chatbotKey}
            settings={chatbotSettings}
            styles={chatbotCustomStyles}
            flow={chatbotFlow}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

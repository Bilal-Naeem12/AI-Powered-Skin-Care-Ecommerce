import { useEffect, useRef } from "react";
import ChatBot from "react-chatbotify";
import { motion, AnimatePresence } from "framer-motion";
import "./Theme/styles.css";
import { getChatbotSettings } from "./Theme/settings";
import { chatbotCustomStyles } from "./Theme/styles";
import { chatbotFlow } from "./chatbotFlow";
import useUserStore from "@/store/useUserStore";
import { useChatbotStore } from "@/store/useChatbotStore";

export const ChatBotUI = () => {
  const { user, isLoggedIn } = useUserStore();
  const { isOpen, closeChatbot } = useChatbotStore();
  const chatbotRef = useRef<HTMLDivElement>(null);

  const chatbotKey = isLoggedIn ? user?._id ?? "loggedIn" : "guest";
  const chatbotSettings = getChatbotSettings(isLoggedIn ? user : null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target as Node)
      ) {
        closeChatbot();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

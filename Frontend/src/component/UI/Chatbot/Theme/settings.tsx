import { User } from "@/types/User";
import { Button } from "react-chatbotify";
import logo from "/assets/logo1.png"
import close from "/assets/close-Icon.png"

// Function that returns dynamic chatbot settings
export const getChatbotSettings = (user:User|null) => ({
  general: {
    primaryColor: "#fb64b6",
    secondaryColor: "#B85340",
    fontFamily: "Segoe UI",
    showHeader: true,
    showFooter: false,
    showInputRow: true,
    embedded: true,
    flowStartTrigger: "ON_LOAD",
    chatLauncher: {
    enabled: false, // hides the floating bubble
  },
  },
  
  chatHistory: {
		disabled: false,
		maxEntries: 30,
		storageKey: "rcb-history",
		storageType: "LOCAL_STORAGE",
		viewChatHistoryButtonText: "Load Chat History ⟳",
		chatHistoryLineBreakText: "----- Previous Chat History -----",
		autoLoad: false,
	},
  tooltip: {
    mode: "NEVER",
  },
  userBubble: {
    animate: true,
    showAvatar: !!user?.profileImage,
    avatar: user?.profileImage ?? "", // or use a placeholder
    simulateStream: false,
    streamSpeed: 30,
  },

  chatInput: {
    enabledPlaceholderText: "What can we help you with?",
    blockSpam: true,
  },
  	botBubble: {
		animate: true,
		showAvatar: true,
		avatar: logo,
		simulateStream: false,
		streamSpeed: 30,
	},
  header: {
    title: "Skin Care Bot",
    showAvatar: true,
    avatar:logo,
   buttons: ["Help", Button.CLOSE_CHAT_BUTTON],

  },
  closeChatIcon: close

});

// src/store/useChatbotStore.ts
import { create } from "zustand";

interface ChatbotState {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  isOpen: false,
  openChatbot: () => set({ isOpen: true }),
  closeChatbot: () => set({ isOpen: false }),
  toggleChatbot: () => set((state) => ({ isOpen: !state.isOpen })),
}));

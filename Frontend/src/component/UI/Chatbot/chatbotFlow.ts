import type { Flow } from "react-chatbotify"; // Adjust if it's a local import
import type { Params } from "react-chatbotify";

export const chatbotFlow: Flow = {
  start: {
    message: "Hi there! 👋 I'm your skincare assistant.",
    path: "askName",
  },

  askName: {
    message: "What's your name?",
    path: "personalGreeting",
  },

  personalGreeting: {
    message: (params: Params) => `Nice to meet you, ${params.userInput}! 💖`,
    path: "skinType",
  },

  skinType: {
    message: "How would you describe your skin type?",
    options: {
      items: ["Oily", "Dry", "Combination", "Normal"],
      sendOutput: true,
      reusable: false,
    },
    path: () => "handleSkinType",
  },

  handleSkinType: {
    message: (params: Params) => `Thanks! We'll tailor recommendations for ${params.userInput.toLowerCase()} skin.`,
    path: "helpOptions",
  },

  helpOptions: {
    message: "What would you like help with today?",
    options: {
      items: ["Product Recommendations", "Routine Tips", "Talk to Support"],
      sendOutput: true,
    },
    path: (params: Params) => {
      switch (params.userInput.toLowerCase()) {
        case "product recommendations":
          return "productHelp";
        case "routine tips":
          return "routineHelp";
        case "talk to support":
          return "support";
        default:
          return "end";
      }
    },
  },

  productHelp: {
    message: "You can try our AI skin analysis tool to get tailored product suggestions! 🧴",
    path: "end",
  },

  routineHelp: {
    message: "Cleanse 🧼, treat ✨, moisturize 💧, and protect ☀️ — the core skincare routine!",
    path: "end",
  },

  support: {
    message: "Please email us at support@skincarepro.ai or chat with our live agent 💬",
    path: "end",
  },

  end: {
    message: "Thanks for chatting with me today! Stay glowing 🌟",
    
  },
};

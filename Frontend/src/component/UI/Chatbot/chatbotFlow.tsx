import type { Flow } from "react-chatbotify";
import type { Params } from "react-chatbotify";
import useFaceScanStore  from "@/store/useFaceScanStore";
import { useChatbotStore } from "@/store/useChatbotStore";
import useUserStore from "@/store/useUserStore";
import ProductCarousel from "../ProductCarousel";


let counter = false
const triggerFaceScan = () => {
  const { setEntryModal } = useFaceScanStore.getState();
  setEntryModal(true);
};


const isLoggedin = () => {
   const {  isLoggedIn } = useUserStore.getState();

 return isLoggedIn
};


let selectedProductName: string | null = null;
let productImageShown = false;



const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const chatbotFlow: Flow = {
  
  start: {
    component: () => (
  <div className="bg-[#fb64b6] text-white rounded-[18px_18px_18px_4px] px-4 py-3 max-w-[260px] mx-3 my-2 shadow-lg text-sm leading-relaxed">
    <strong className="block mb-1 text-lg">Welcome to SkinCare Bot</strong>
    I’m here to help you find the right products, routines, and support for your skin needs.<strong className="text-lg"> Say 'Hi' 👋</strong> 
  </div>
  ),path: "welcomeOptions",
  },

  welcomeOptions: {
    
    message: "What brings you here today?",
    options: {
      items: [
        "Start AI Skin Scan",
        "Product Inquries",
        "Personalized Skin Consultation",
        "View My Past Analysis",
        "Other Help",
      ],
      sendOutput: true,
    },
    path: (params: Params) => {
      switch (params.userInput.toLowerCase()) {
        case "start ai skin scan":
          return "aiSkinScan";
        case "product inquries":
          return "productHelp";
        case "personalized skin consultation":
          return "consultationStart";
        case "view my past analysis":
          return "viewAnalysis";
        case "other help":
          return "moreHelp";
        default:
          return "goodbye";
      }
    },
  },


    repeatOptions: {
    message: "How can I assist you futher?",
    options: {
      items: [
        "Start AI Skin Scan",
        "Product Inquries",
        "Personalized Skin Consultation",
        "View My Past Analysis",
        "Other Help",
      ],
      sendOutput: true,
    },
    path: (params: Params) => {
      switch (params.userInput.toLowerCase()) {
        case "start ai skin scan":
          return "aiSkinScan";
        case "product inquries":
          return "productHelp";
        case "personalized skin consultation":
          return "consultationStart";
        case "view my past analysis":
          return "viewAnalysis";
        case "other help":
          return "moreHelp";
        default:
          return "goodbye";
      }
    },
  },

aiSkinScan: {
  component: async (params: Params) => {
    await params.injectMessage("Please wait while we open the face scan tool...");
  await new Promise(resolve => setTimeout(resolve, 1500));
    // ✅ Trigger modal using Zustand
    triggerFaceScan();
    
    // ✅ Wait and go to next step
   
  },
  chatDisabled: true,
},

  productHelp: {
  component: () => (
  <div className="bg-[#fb64b6] text-white rounded-[18px_18px_18px_4px] px-4 py-3 max-w-[260px] mx-3 my-2 shadow-lg text-sm leading-relaxed">
  <div className=" font-semibold mb-1 text-lg" >
    Product Inquries
  </div>

  <div className="mb-2">
    Ask me about products.
  </div>

  <div className="bg-white text-black text-xs border border-blue-100 p-2 rounded shadow-sm mb-2">
    <p className="font-medium text-sm">Try asking about:</p>
    <ul className="list-disc list-inside ">
      <li>Usage</li>
      <li>Availability</li>
      <li>Price</li>
      <li>Ingredients</li>
      <li>Suitability</li>
    </ul>
  </div>

  <div className="text-sm">
    🧾 Example: “Is CeraVe in stock?” or “How to use Niacinamide?”
  </div>
</div>

  ),
//  message: "Let me look that up for you...",
path: async (params: Params) => {
  const userInput = params.userInput.toLowerCase();
if (["no", "next", "none"].some(w => userInput.includes(w))) {
  selectedProductName = null;
  productImageShown = false;
  return "moreHelpLoop";
}
let enrichedInput = params.userInput;
if (
  selectedProductName &&
  !userInput.includes(selectedProductName.toLowerCase())
) {
  enrichedInput = `${params.userInput} about ${selectedProductName}`;
}
  try {
    const response = await fetch(import.meta.env.VITE_API_MAKE_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserMessage: enrichedInput }),
    });

    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    
    const products = data?.products ?? [];

    const productName = data?.productName ?? null;
    const image = data?.image ?? null;
    const reply = data?.reply ?? "Sorry, I couldn’t find a clear answer.";
    const replyNotFound = data?.replyNotFound ?? null;
    const  replyIrrelavent = data?.replyIrrelavent ?? null;
// const products = dummyproducts;
    // 🖼️ If multiple product matches
    selectedProductName = productName
    if (products.length > 0) {
      await params.injectMessage(
        <div className="p-3">
         <ProductCarousel
  products={products}
  onProductSelect={async (selectedName) => {
      productImageShown = false; // ✅ So new image shows
    await params.setTextAreaValue(selectedName);
    // await params.goToPath(params.currPath ?? "productHelp");
  }}
/>

<div className="bg-[#fb64b6] text-white rounded-[18px_18px_18px_4px] px-4 py-3 max-w-[260px] mx-3 my-2 shadow-lg text-lg capitalize leading-relaxed"><p className="font-medium mb-1">🔍 Multiple matches found</p>
    <p>Please select the product you'd like to ask about.</p>
</div>
        </div>
      );
      
   
   return; }else{
    if(replyIrrelavent){
      await params.injectMessage(replyIrrelavent)
      return "moreHelpLoop"
    }
    console.log(replyIrrelavent)
    // ❌ If product not found
    if (replyNotFound) {
      await params.injectMessage(replyNotFound);
      return "productHelpError";
    }
    // ✅ If single match with image
    if (productName && image && !productImageShown) {
      await params.injectMessage(
        <div className="flex flex-col gap-2 items-center p-3 m-3 border border-gray-200 rounded-lg shadow-sm bg-white max-w-[250px]">
          <img
            src={image}
            alt={productName}
            className="w-full h-32 object-contain rounded-md border"
          />
          <div className="text-sm font-medium text-gray-800">{productName}</div>
        </div>
        
      );
        productImageShown = true;
    }
    await params.injectMessage(reply);

await delay(10000); // Wait 4 seconds

   await params.injectMessage(
    <div className="bg-blue-50 text-sm text-gray-800 rounded-[16px_16px_16px_4px] px-4 py-3 max-w-[260px] my-5 shadow-sm" style={{marginLeft:"45px"}}>
      <p className="font-medium">💬 Want to ask more about <strong>{productName}</strong>?</p>
      <p className="text-xs mt-1">
        If yes, type your question (e.g., "What are its ingredients?").<br />
        If not, just say "no" or "next".
      </p>
    </div>
  );
}
    // ✅ Always show the reply
    
  } catch (err) {
    console.log(err)
    return "productHelpError";
  }
}
},

confirmFollowup: {
  path: async (params: Params) => {
    const msg = params.userInput.toLowerCase();

    if (["no", "next", "none"].some(w => msg.includes(w))) {
      selectedProductName = null; // clear for safety
      return "moreHelpLoop";
    }

    // 🧠 Auto-ask about the stored product
    if (selectedProductName) {
      await params.setTextAreaValue(`${msg} about ${selectedProductName}`);
    }

    return "productHelp";
  }
},

  consultationStart: {
    message: "Let's begin your personalized consultation.",
    path: "askSkinType",
  },

  askSkinType: {
    message: "How would you describe your skin type?",
    options: {
      items: ["Oily", "Dry", "Combination", "Normal"],
      sendOutput: true,
    },
    path: (params: Params) => {
      (window as any).skinType = params.userInput;
      return "askConcerns";
    },
  },

  askConcerns: {
    message: "What are your current skin concerns?",
    checkboxes: {
      items: ["Acne", "Pigmentation", "Wrinkles", "Sensitivity", "Dullness"],
      min: 1,
      max: 3,
      sendOutput: true,
    },
    path: (params: Params) => {
      (window as any).skinConcerns = params.userInput;
      return "consultationResult";
    },
  },

  consultationResult: {
    message: () => {
      const type = (window as any).skinType ?? "your";
      const concerns = (window as any).skinConcerns ?? "various concerns";
      return `Thanks for the details. Based on ${type} skin with concerns like ${concerns}, I'll tailor your routine next.`;
    },
    path: "moreHelpLoop",
  },

viewAnalysis: {
  component: async (params: Params) => {
    await params.injectMessage("Redirecting you to your analysis timeline...");
    await new Promise(resolve => setTimeout(resolve, 1200));

    const { goTo } = await import("@/utils/navigation");
  
    if (!isLoggedin()) {
      await params.injectMessage("Kindly login first");
    }

    // Navigate regardless
    goTo("/profile-page/analysis-timeline");

    // Immediately continue the chat flow
    await params.goToPath("moreHelpLoop");
  },
  chatDisabled: true,
},


  routineHelp: {
    message:
      "A good skincare routine includes cleansing, treatment, moisturizing, and sun protection. Would you like a full guide?",
    path: "moreHelpLoop",
  },

  moreHelp: {
    message:
      "No worries. You can type your question here, and I’ll try to assist you. You can also visit the Help Center for more support.",
    path: "moreHelpLoop",
  },

  moreHelpLoop: {
    message: "Would you like help with anything else?",
    options: {
      items: ["Yes", "No"],
      sendOutput: true,
    },
    path: (params: Params) =>
      params.userInput.toLowerCase() === "yes" ? "repeatOptions" : "goodbye",
  },
productHelpError: {
  message: "Something went wrong while fetching the product info. Please try again in a moment.",
  path: "moreHelpLoop",
},
  goodbye: {
    message: "Thank you for chatting with SkinCare Pro. Have a great day!",
  },
};

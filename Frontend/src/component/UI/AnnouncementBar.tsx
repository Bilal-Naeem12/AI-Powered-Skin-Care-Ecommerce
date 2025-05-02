import React from "react";

const messages = [
  "✨ AI-Powered Skin Analysis is Live – Scan now and get personalized product picks!",
  "🔍 Discover what your skin really needs – Let our AI create your ideal skincare routine!",
  "🌟 Your journey to healthier, glowing skin starts here – Powered by smart skin diagnostics!",
];


const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-black text-white overflow-hidden whitespace-nowrap py-2 text-sm font-medium relative">
     <div className="animate-marquee  flex space-x-10">
        {messages.map((msg, index) => (
          <span key={index} className="mx-4">
            {msg}
          </span>
        ))}
        {/* Repeat the messages for seamless loop */}
        {messages.map((msg, index) => (
          <span key={`repeat-${index}`} className="mx-4">
            {msg}
          </span>
        ))}
      </div>
      
    </div>
    
  );
};

export default AnnouncementBar;

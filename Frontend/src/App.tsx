import React from "react";
import AppRouter from "./router/AppRouter";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toastify
import ChatBot from "react-chatbotify";
import { ChatBotUI } from "./component/UI/Chatbot/ChatBot";

const App: React.FC = () => {
  return (
    <div>
      {/* The ToastContainer is required to display notifications */}
      <ToastContainer
        position="bottom-left"
        autoClose={ 5000} // Auto close after 5 seconds
        hideProgressBar={false} // Show progress bar
        newestOnTop={false}
        closeOnClick
        rtl={false} // Right to left support
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
       <ChatBotUI/>
      
      <AppRouter />
    </div>
  );
};

export default App;

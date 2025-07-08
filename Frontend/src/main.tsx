import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the App component (which should now be in App.tsx)
import './index.css';
import { ChatBotProvider } from 'react-chatbotify';
import NotificationProvider from './component/UI/NotificationProvider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// React 18+ entry point
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <NotificationProvider />
       <LocalizationProvider dateAdapter={AdapterDateFns}>
       <ChatBotProvider>
    <App />
    
    </ChatBotProvider>
    </LocalizationProvider>
  </React.StrictMode>
);

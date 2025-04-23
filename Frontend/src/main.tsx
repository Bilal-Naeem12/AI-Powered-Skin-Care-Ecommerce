import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the App component (which should now be in App.tsx)
import './style/index.css';

// React 18+ entry point
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

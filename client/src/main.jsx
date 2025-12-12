// client/src/main.jsx - FINAL CORRECT CODE

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 
import { BrowserRouter } from 'react-router-dom';

// Zaroori: AuthProvider import ko uncomment karein
import { AuthProvider } from './context/AuthContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Zaroori: AuthProvider se App ko wrap karein */}
    <AuthProvider>  
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
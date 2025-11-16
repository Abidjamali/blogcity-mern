// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Aapki global CSS file
import { BrowserRouter } from 'react-router-dom';

// --- YEH DO LINES NAHI HAIN ---
// 1. AuthProvider ko import karein
import { AuthProvider } from './context/AuthContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Poori app ko 'AuthProvider' se wrap karein */}
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
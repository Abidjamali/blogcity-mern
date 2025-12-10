<<<<<<< HEAD
// src/main.jsx
=======
// client/src/main.jsx
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
<<<<<<< HEAD
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // <-- Router ko import kiya

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- Step 1: App ko wrap kiya */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
=======
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
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80

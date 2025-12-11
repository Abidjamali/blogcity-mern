import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 
import { BrowserRouter } from 'react-router-dom';

// Zaroori: Agar aap AuthContext use kar rahe hain, toh isko import karein
// import { AuthProvider } from './context/AuthContext.jsx'; // <--- Agar aapne yeh file banayi hai toh uncomment karein

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Agar AuthProvider hai toh usse wrap karein, nahi toh sirf BrowserRouter rakhein */}
    {/* <AuthProvider> */} 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    {/* </AuthProvider> */}
  </React.StrictMode>
);
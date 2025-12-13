// client/src/App.jsx - FINAL CORRECT CODE

import React from 'react';
// FIX: BrowserRouter ko yahan se hata diya gaya hai
import { Routes, Route } from 'react-router-dom'; 

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// NOTE: Ensure this file exists: client/src/pages/HomePage.jsx
import HomePage from './pages/HomePage'; 
// (Agar aapke paas aur pages hain toh unko bhi yahan import karein)


function App() {
  return (
    // FIX: Router tags yahan se hata diye gaye hain
    <> 
      <Navbar />
      <main>
        <Routes>
          {/* FIX: Default Home Page route ko uncomment karein */}
          <Route path="/" element={<HomePage />} /> 
          
          {/* Aapke doosre routes (Login, Register, etc.) yahan aayenge */}
          
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
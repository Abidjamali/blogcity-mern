// client/src/App.jsx - FINAL CORRECT CODE

import React from 'react';
// FIX: BrowserRouter ko yahan se hata diya gaya hai
import { Routes, Route } from 'react-router-dom'; 

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// FIX: HomePage component ko uncomment karein
import HomePage from './pages/HomePage'; 
// NOTE: Agar aapke paas yeh file nahi hai toh naya error aayega. 
// Main maan raha hoon ki yeh file aapke paas hai.


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
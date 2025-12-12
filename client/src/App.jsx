import React from 'react';
// BrowserRouter ko yahan se hata diya gaya hai, sirf Routes aur Route hain
import { Routes, Route } from 'react-router-dom'; 

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Zaroori: HomePage component ko uncomment kar dein
import HomePage from './pages/HomePage'; 
// (Agar aapke paas aur pages hain toh unko bhi yahan import karein, jaise Login/Register)


function App() {
  return (
    // <> fragment ka use kiya gaya hai kyunki Router main.jsx mein hai
    <> 
      <Navbar />
      <main> {/* main tag mein poora content wrap kar dein for index.css to work */}
        <Routes>
          {/* Default Home Page route */}
          <Route path="/" element={<HomePage />} /> 
          
          {/* Aapke doosre routes yahan add honge, jaise: */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/create" element={<CreatePostPage />} /> */}
          
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
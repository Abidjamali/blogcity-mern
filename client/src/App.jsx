// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages / Components
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import SinglePostPage from './pages/SinglePostPage.jsx';
import EditPostPage from './pages/EditPostPage.jsx';
import Footer from './components/Footer.jsx';
function App() {
  return (
    <div>
      <Navbar />
      
      <main>
        <Routes> 
          
          {/* Rasta 1: Homepage */}
          <Route path="/" element={<HomePage />} />
          
          {/* Rasta 2: Create Page */}
          <Route path="/create" element={<CreatePostPage />} /> 
          
          {/* Rasta 3: Single Post Page */}
          <Route path="/post/:id" element={<SinglePostPage />} /> 
          
          {/* RASTA 4: YEH LINE MISSING THI YA GALAT THI */}
          <Route path="/edit/:id" element={<EditPostPage />} /> 
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
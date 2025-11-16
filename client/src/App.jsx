// client/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import SinglePostPage from './pages/SinglePostPage';
import EditPostPage from './pages/EditPostPage';
import ProfilePage from './pages/ProfilePage';   // <-- NAYA
import MyPostsPage from './pages/MyPostsPage';   // <-- NAYA

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // <-- YEH ZAROORI HAI

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <Routes> 
          {/* Public Routes (Sab dekh sakte hain) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/post/:id" element={<SinglePostPage />} />
          
          {/* --- Protected Routes (Sirf Logged-in users) --- */}
          {/* Yeh '/create' route ko protect karega */}
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            } 
          />
          {/* Yeh '/edit/:id' route ko protect karega */}
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            } 
          />
          {/* Yeh '/profile' route ko protect karega */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          {/* Yeh '/my-posts' route ko protect karega */}
          <Route 
            path="/my-posts" 
            element={
              <ProtectedRoute>
                <MyPostsPage />
              </ProtectedRoute>
            } 
          />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
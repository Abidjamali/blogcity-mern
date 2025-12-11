import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Import your pages here
// import HomePage from './pages/HomePage'; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* Add your other routes here */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
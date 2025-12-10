// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {}
            <div>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    {}
                    <img 
                        src="/logo.png"
                        alt="BlogCity Logo" 
                        style={{ height: '150px', width: 'auto', display: 'block' }} // Height control karein
                    />
                </Link>
            </div>
            <ul>
                <li style={{ display: 'inline-block', marginLeft: '20px' }}>
                    <Link to="/">Home</Link>
                </li>
                <li style={{ display: 'inline-block', marginLeft: '20px' }}>
                    <Link to="/create">Create New Post</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
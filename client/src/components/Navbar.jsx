// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    // --- YEH HUMNE FIX KIYA HAI ---
    // Pehle check karein 'user' hai, phir 'profilePicture' hai, phir 'url' hai.
    const profileImageUrl = user?.profilePicture?.url || '/default-avatar.png';

    return (
        <nav style={styles.nav}>
            <div style={styles.left}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <img
                        src="/logo.png" // (Yeh pehle se theek tha)
                        alt="BlogCity Logo"
                        style={styles.logo}
                    />
                </Link>
            </div>

            <div style={styles.right}>
                <ul style={styles.ul}>
                    <li style={styles.li}>
                        <Link to="/" style={styles.link}>
                            Home
                        </Link>
                    </li>

                    {user ? (
                        <>
                            <li style={styles.li}>
                                <Link to="/create" style={styles.link}>
                                    Create Post
                                </Link>
                            </li>
                            <li style={styles.li}>
                                <div style={styles.dropdownContainer}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        style={styles.userButton}
                                    >
                                        <img
                                            // --- YEH HUMNE FIX KIYA HAI ---
                                            src={profileImageUrl} 
                                            alt={user.username}
                                            style={styles.avatar}
                                            onError={(e) => {
                                                // Agar Cloudinary link bhi fail ho, tab default dikhayein
                                                e.target.src = '/default-avatar.png';
                                            }}
                                        />
                                        {user.username}
                                        <span style={styles.dropdownArrow}>
                                            {showDropdown ? '▲' : '▼'}
                                        </span>
                                    </button>

                                    {showDropdown && (
                                        <div style={styles.dropdown}>
                                            <Link
                                                to="/profile"
                                                style={styles.dropdownItem}
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                👤 Profile
                                            </Link>
                                            <Link
                                                to="/my-posts"
                                                style={styles.dropdownItem}
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                📄 My Posts
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                style={styles.logoutButton}
                                            >
                                                🚪 Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        </>
                    ) : (
                        // ... (Login/Register ke links waise hi rahenge)
                        <>
                            <li style={styles.li}>
                                <Link to="/login" style={styles.link}>
                                    Login
                                </Link>
                            </li>
                            <li style={styles.li}>
                                <Link to="/register" style={styles.registerButton}>
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

// (Neeche ka poora 'styles' object waisa hi rahega)
const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1000
    },
    left: {},
    logo: {
        height: '60px',
        width: 'auto',
        display: 'block'
    },
    right: {},
    ul: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center'
    },
    li: {
        display: 'inline-block',
        marginLeft: '30px'
    },
    link: {
        textDecoration: 'none',
        color: '#333',
        fontSize: '16px',
        fontWeight: '500',
        padding: '8px 12px',
        borderRadius: '6px',
        transition: 'all 0.3s'
    },
    registerButton: {
        textDecoration: 'none',
        color: '#fff',
        backgroundColor: '#007bff',
        fontSize: '16px',
        fontWeight: '500',
        padding: '8px 16px',
        borderRadius: '6px',
        transition: 'all 0.3s',
        border: 'none',
        cursor: 'pointer'
    },
    dropdownContainer: {
        position: 'relative'
    },
    userButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'none',
        border: '1px solid #ddd',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        color: '#333',
        transition: 'all 0.3s'
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dropdownArrow: {
        fontSize: '12px',
        marginLeft: '4px'
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '8px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '160px',
        overflow: 'hidden'
    },
    dropdownItem: {
        display: 'block',
        padding: '12px 16px',
        color: '#333',
        textDecoration: 'none',
        fontSize: '14px',
        border: 'none',
        background: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    logoutButton: {
        display: 'block',
        padding: '12px 16px',
        color: '#dc3545',
        textDecoration: 'none',
        fontSize: '14px',
        border: 'none',
        background: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        borderTop: '1px solid #eee'
    }
};

// (Hover effects wala code neeche waisa hi rahega)
styles.link.onMouseEnter = (e) => { e.target.style.backgroundColor = '#f8f9fa'; e.target.style.color = '#007bff'; };
styles.link.onMouseLeave = (e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#333'; };
styles.registerButton.onMouseEnter = (e) => { e.target.style.backgroundColor = '#0056b3'; e.target.style.transform = 'translateY(-1px)'; };
styles.registerButton.onMouseLeave = (e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'translateY(0)'; };
styles.userButton.onMouseEnter = (e) => { e.target.style.backgroundColor = '#f8f9fa'; };
styles.userButton.onMouseLeave = (e) => { e.target.style.backgroundColor = 'transparent'; };
styles.dropdownItem.onMouseEnter = (e) => { e.target.style.backgroundColor = '#f8f9fa'; };
styles.dropdownItem.onMouseLeave = (e) => { e.target.style.backgroundColor = 'transparent'; };
styles.logoutButton.onMouseEnter = (e) => { e.target.style.backgroundColor = '#f8f9fa'; };
styles.logoutButton.onMouseLeave = (e) => { e.target.style.backgroundColor = 'transparent'; };

export default Navbar;
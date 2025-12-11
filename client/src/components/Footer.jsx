// src/components/Footer.jsx

import React from 'react';

const Footer = () => {
    // Thodi si inline styling (hum CSS file mein bhi daal sakte hain)
    const footerStyle = {
        background: '#333',
        color: '#fff',
        textAlign: 'center',
        padding: '20px 0',
        marginTop: '30px', // Page content se thoda neeche
    };

    return (
        <footer style={footerStyle}>
            <p>&copy; {new Date().getFullYear()} BlogCity. All Rights Reserved.</p>
            <p>A Full-Stack MERN Project</p>
            <p>Abid Ali Jamali's project</p>
        </footer>
    );
};

export default Footer;
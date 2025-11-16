// client/src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css'; // Hum iske liye CSS banayenge

const ProfilePage = () => {
    const { user, updateProfile, loading, error } = useAuth();

    // Form state ko user ke current data se shuru karein
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [newImage, setNewImage] = useState(null); // File ke liye
    const [preview, setPreview] = useState(null); // Nayi image ka preview dikhane ke liye
    const [message, setMessage] = useState(null);

    // Image select karne par
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setPreview(URL.createObjectURL(file)); // File ka temporary URL bana kar preview dikhayein
        }
    };

    // Form submit karne par
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        // FormData object banayein (kyunki hum file bhej rahe hain)
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        if (newImage) {
            // 'featuredImage' naam bilkul wahi hona chahiye jo humne backend (Multer) mein rakha tha
            // Humne multer middleware mein 'upload.single('featuredImage')' use kiya tha
            formData.append('featuredImage', newImage); 
        }

        const result = await updateProfile(formData);
        
        if (result.success) {
            setMessage('Profile updated successfully!');
            setNewImage(null);
            setPreview(null);
        } else {
            // Error message AuthContext se aa jayega
        }
    };

    // Current image (ya nayi image ka preview) dikhane ke liye URL
    const currentImageUrl = preview || user.profilePicture?.url || '/default-avatar.png';

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
                
                <div className="avatar-upload">
                    <img 
                        src={currentImageUrl} 
                        alt="Profile Avatar" 
                        className="avatar-preview"
                        onError={(e) => { e.target.src = '/default-avatar.png'; }}
                    />
                    <label htmlFor="avatarInput" className="avatar-label">
                        Change Picture
                    </label>
                    <input
                        id="avatarInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }} // Input ko chupa dein
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
            </form>
        </div>
    );
};

export default ProfilePage;
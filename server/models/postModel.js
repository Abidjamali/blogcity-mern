// server/models/postModel.js

import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: false,
            default: 'Admin',
        },
<<<<<<< HEAD
=======
        // User association for authentication
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
>>>>>>> 2d96f5df923e9cee0173950bf1419661c487bd80
        // --- YEH NAYA ADD HUA HAI ---
        featuredImage: {
            public_id: { type: String, required: false }, // Cloudinary se milega
            url: { type: String, required: false }       // Cloudinary se milega
        }
    },
    {
        timestamps: true, // Yeh 'createdAt' aur 'updatedAt' banayega
    }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
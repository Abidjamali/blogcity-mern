// server/index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import postRoutes from './routes/postRoutes.js'; // <-- Routes ko import kiya

// Load environment variables
dotenv.config();

// Variables
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middlewares
app.use(cors());
app.use(express.json()); // JSON data parse karne ke liye

// --- API Routes ---
// YEH LINE 404 KO FIX KAREGI
// Iska matlab: Jab bhi koi /api/posts par aaye, usse postRoutes par bhej do
app.use('/api/posts', postRoutes); 

// Test Route
app.get('/', (req, res) => {
    res.send('BlogCity Server API is running!');
});

// --- Database Connection & Server Start ---
console.log("Connecting to MongoDB...");
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB!');

        // Sirf DB connect hone ke BAAD server start karo
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    });
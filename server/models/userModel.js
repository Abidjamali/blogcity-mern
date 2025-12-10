// server/models/userModel.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        // Email validation
        match: [
            /^\S+@\S+\.\S+$/,
            'Please enter a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Password ko queries mein wapas na bhejo
    },
    // --- YEH HUMNE UPDATE KIYA HAI ---
    // (Pehle yeh shayad 'String' tha, ab yeh object hai)
    profilePicture: {
        public_id: {
            type: String,
            default: null
        },
        url: {
            type: String,
            default: '/default-avatar.png' // Default image
        }
    }
}, {
    timestamps: true, // createdAt aur updatedAt add karega
    toJSON: { 
        // Password hash ko JSON response se hatane ke liye
        transform(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

// Password hash karne ke liye (Save karne se pehle)
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password compare karne ke liye (Login ke waqt)
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
// server/models/commentModel.js

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null, // null for top-level comments, ObjectId for replies
        },
        authorName: {
            type: String,
            required: true,
            trim: true,
        },
        authorEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        isApproved: {
            type: Boolean,
            default: true, // Comments will be auto-approved
        },
        replyCount: {
            type: Number,
            default: 0, // Track number of replies
        }
    },
    {
        timestamps: true, // 'createdAt' and 'updatedAt'
    }
);

// Index for better query performance
commentSchema.index({ postId: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
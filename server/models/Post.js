import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    platformId: {
        type: String,
        required: true,
        unique: true
    },
    caption: {
        type: String
    },
    mediaUrl: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,  // Cloudinary URL for the thumbnail image
        required: true
    },
    permalink: {
        type: String,
        required: true
    },
    publishedAt: {
        type: Date,
        required: true
    },
    source: {
        type: String,
        default: 'instagram'
    },
    type: {
        type: String,
        enum: ['reel', 'post', 'video'],
        default: 'reel'
    }
}, { timestamps: true });

export const Post = mongoose.model('Post', PostSchema);

import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
    platformId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    publishedAt: { type: Date, required: true },
    source: { type: String, default: 'youtube' }
}, { timestamps: true });

export const Video = mongoose.model('Video', VideoSchema);

import { Video } from '../models/Video.js';
import { Post } from '../models/Post.js';
import axios from 'axios';

// @desc    Get mixed content for homepage (latest Videos & Posts)
// @route   GET /api/content/latest
// @access  Public
const getLatestContent = async (req, res) => {
    console.log(`[ContentController] ${req.method} ${req.originalUrl} called`);

    try {
        const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
        const API_KEY = process.env.YOUTUBE_API_KEY;

        let videos = [];

        if (CHANNEL_ID && API_KEY) {
            try {
                // Uploads playlist ID (UC -> UU)
                const uploadsPlaylistId = CHANNEL_ID.replace('UC', 'UU');

                const response = await axios.get(
                    'https://www.googleapis.com/youtube/v3/playlistItems',
                    {
                        params: {
                            part: 'snippet,contentDetails',
                            playlistId: uploadsPlaylistId,
                            maxResults: 6,
                            key: API_KEY
                        }
                    }
                );

                const items = response.data?.items || [];

                videos = items.map(item => {
                    const videoId = item.contentDetails?.videoId;
                    const snippet = item.snippet;

                    return {
                        platformId: videoId,
                        title: snippet.title,
                        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
                        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
                        publishedAt: snippet.publishedAt,
                        source: 'youtube'
                    };
                });

            } catch (ytError) {
                console.error("[ContentController] YouTube API Error:", ytError.message);
                // Fallback to DB if API fails (optional, but good practice, though user asked for API)
                videos = await Video.find().sort({ publishedAt: -1 }).limit(6);
            }
        } else {
            videos = await Video.find().sort({ publishedAt: -1 }).limit(6);
        }

        const posts = await Post.find().sort({ publishedAt: -1 }).limit(3);

        // Determine latest content for Hero (YouTube or Instagram)
        const allContent = [...videos, ...posts];
        allContent.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        const latestHero = allContent.length > 0 ? allContent[0] : null;

        console.log(`[ContentController] Fetched latest content - Videos: ${videos.length}, Posts: ${posts.length}, Hero: ${latestHero?.source}`);
        res.status(200).json({
            success: true,
            message: "Latest content fetched successfully",
            data: {
                videos: videos,
                posts: posts,
                latestHero: latestHero
            }
        });
    } catch (error) {
        console.error("[ContentController] Error fetching latest content: ", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch latest content"
        });
    }
};


// ============================================
// Manual Instagram Reel Entry API
// ============================================

import { uploadOnCloudinary } from '../config/cloudinary.js';

// @desc    Add a new Instagram reel manually (with image upload)
// @route   POST /api/content/instagram
// @access  Admin
const addInstagramReel = async (req, res) => {
    console.log(`[ContentController] ${req.method} ${req.originalUrl} - Adding Instagram reel`);

    try {
        const { shortcode, caption } = req.body;
        const thumbnailFile = req.file;

        if (!shortcode) {
            return res.status(400).json({
                success: false,
                message: "Shortcode is required"
            });
        }

        if (!thumbnailFile) {
            return res.status(400).json({
                success: false,
                message: "Thumbnail image is required"
            });
        }

        // Upload image to Cloudinary
        console.log(`[ContentController] Uploading thumbnail to Cloudinary: ${thumbnailFile.path}`);
        const cloudinaryResult = await uploadOnCloudinary(thumbnailFile.path);

        if (!cloudinaryResult || !cloudinaryResult.secure_url) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload image to Cloudinary"
            });
        }

        const thumbnailUrl = cloudinaryResult.secure_url;
        console.log(`[ContentController] Cloudinary upload successful: ${thumbnailUrl}`);

        // Create Instagram permalink
        const permalink = `https://www.instagram.com/reel/${shortcode}/`;

        // Check if already exists
        const existing = await Post.findOne({ platformId: shortcode });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "This reel already exists"
            });
        }

        const newPost = await Post.create({
            platformId: shortcode,
            caption: caption || 'Instagram Reel',
            mediaUrl: permalink,
            thumbnail: thumbnailUrl,
            permalink: permalink,
            publishedAt: new Date(),
            source: 'instagram',
            type: 'reel'
        });

        console.log(`[ContentController] Added Instagram reel: ${shortcode}`);
        res.status(201).json({
            success: true,
            message: "Instagram reel added successfully",
            data: newPost
        });

    } catch (error) {
        console.error("[ContentController] Error adding Instagram reel:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to add Instagram reel"
        });
    }
};


// @desc    Get all Instagram reels
// @route   GET /api/content/instagram
// @access  Admin
const getInstagramReels = async (req, res) => {
    try {
        const reels = await Post.find({ source: 'instagram' }).sort({ publishedAt: -1 });

        res.status(200).json({
            success: true,
            data: reels
        });
    } catch (error) {
        console.error("[ContentController] Error fetching Instagram reels:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch Instagram reels"
        });
    }
};

// @desc    Delete an Instagram reel
// @route   DELETE /api/content/instagram/:id
// @access  Admin
const deleteInstagramReel = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Post.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Reel not found"
            });
        }

        console.log(`[ContentController] Deleted Instagram reel: ${deleted.platformId}`);
        res.status(200).json({
            success: true,
            message: "Instagram reel deleted successfully"
        });
    } catch (error) {
        console.error("[ContentController] Error deleting Instagram reel:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete Instagram reel"
        });
    }
};

export { getLatestContent, addInstagramReel, getInstagramReels, deleteInstagramReel };

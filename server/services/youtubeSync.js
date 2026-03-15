import axios from 'axios';
import { Video } from '../models/Video.js';

export const syncYouTubeVideos = async () => {
    console.log('[YouTube Sync] Starting sync');

    try {
        const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
        const API_KEY = process.env.YOUTUBE_API_KEY;

        if (!CHANNEL_ID || !API_KEY) {
            console.error('[YouTube Sync] Missing YOUTUBE_CHANNEL_ID or YOUTUBE_API_KEY');
            return;
        }

        // YouTube channel IDs (UC...) map to upload playlists (UU...)
        const uploadsPlaylistId = CHANNEL_ID.replace('UC', 'UU');

        const response = await axios.get(
            'https://www.googleapis.com/youtube/v3/playlistItems',
            {
                params: {
                    part: 'snippet,contentDetails',
                    playlistId: uploadsPlaylistId,
                    maxResults: 10, // fetch more, trim later
                    key: API_KEY
                }
            }
        );

        const items = response.data?.items || [];
        console.log('[YouTube Sync] Videos fetched:', items.length);

        // Sort by newest first and keep only 9 most recent videos
        items.sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt));
        const latestVideos = items.slice(0, 9);

        for (const item of latestVideos) {
            const videoId = item.contentDetails?.videoId;
            const snippet = item.snippet;

            if (!videoId || !snippet) continue;

            const thumbnail =
                snippet.thumbnails?.high?.url ||
                snippet.thumbnails?.medium?.url ||
                snippet.thumbnails?.default?.url;

            if (!thumbnail) {
                console.warn('[YouTube Sync] Skipping video with no thumbnail:', videoId);
                continue;
            }

            await Video.findOneAndUpdate(
                { platformId: videoId },
                {
                    platformId: videoId,
                    title: snippet.title,
                    thumbnail,
                    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
                    publishedAt: new Date(snippet.publishedAt),
                    source: 'youtube'
                },
                {
                    upsert: true,
                    new: true
                }
            );
        }

        console.log('[YouTube Sync] Latest 6 videos sync completed');

    } catch (error) {
        console.error(
            '[YouTube Sync] Sync failed:',
            error.response?.data || error.message
        );
    }
};

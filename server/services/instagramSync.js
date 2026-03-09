import axios from 'axios';
import { Post } from '../models/Post.js';

export const syncInstagramReels = async () => {
    console.log('[Instagram Sync] Starting reels sync');

    try {
        const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

        if (!ACCESS_TOKEN) {
            console.error('[Instagram Sync] Missing INSTAGRAM_ACCESS_TOKEN');
            return;
        }

        const response = await axios.get(
            'https://graph.instagram.com/me/media',
            {
                params: {
                    fields:
                        'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
                    access_token: ACCESS_TOKEN
                }
            }
        );

        const media = response.data?.data || [];

        // 1. Filter only Reels (VIDEO)
        const reels = media.filter(
            item => item.media_type === 'VIDEO'
        );

        // 2. Sort by latest first
        reels.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        // 3. Take only latest 6 reels
        const latestReels = reels.slice(0, 6);

        console.log('[Instagram Sync] Reels to sync:', latestReels.length);

        for (const item of latestReels) {
            const mediaUrl =
                item.media_url || item.thumbnail_url;

            if (!mediaUrl) {
                console.warn(
                    '[Instagram Sync] Skipping reel with missing media URL:',
                    item.id
                );
                continue;
            }

            await Post.findOneAndUpdate(
                { platformId: item.id },
                {
                    platformId: item.id,
                    caption: item.caption || '',
                    mediaUrl,
                    permalink: item.permalink,
                    publishedAt: new Date(item.timestamp),
                    source: 'instagram'
                },
                {
                    upsert: true,
                    new: true
                }
            );
        }

        console.log('[Instagram Sync] Latest 6 reels sync completed');

    } catch (error) {
        console.error(
            '[Instagram Sync] Sync failed:',
            error.response?.data || error.message
        );
    }
};

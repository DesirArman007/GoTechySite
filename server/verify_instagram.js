import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { scrapeInstagramReels } from './services/instagramScraper.js';
import { Post } from './models/Post.js';

dotenv.config({ path: 'server/.env' });
console.log('DEBUG: Loaded Env Vars:', {
    INSTAGRAM_USERNAME: process.env.INSTAGRAM_USERNAME,
    MONGODB_URL: process.env.MONGODB_URL ? 'Exists' : 'Missing'
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const verifyInstagram = async () => {
    await connectDB();

    try {
        console.log('--- Triggering Instagram Scraper ---');
        await scrapeInstagramReels();
        console.log('--- Scrape Completed ---');

        const count = await Post.countDocuments();
        console.log(`Total Posts in DB: ${count}`);

        if (count > 0) {
            const posts = await Post.find({ source: 'instagram' }).sort({ publishedAt: -1 }).limit(3);
            console.log('Latest 3 Instagram Posts:');
            posts.forEach(p => console.log(`- ${p.caption.substring(0, 30)}... (${p.publishedAt}) [Has Video? ${!!p.mediaUrl}]`));
        }
    } catch (error) {
        console.error('Error verifying instagram:', error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

verifyInstagram();

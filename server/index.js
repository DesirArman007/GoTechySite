import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';
import { syncYouTubeVideos } from './services/youtubeSync.js';
import cron from 'node-cron';


connectDB().then(() => {
    app.listen(process.env.PORT || 8080, () => {

        const isProduction = process.env.NODE_ENV === 'production';
        console.log("Server started");
        console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
        console.log(`PORT: ${process.env.PORT || 8080}`);
        console.log(`HTTPS assumed: ${isProduction}`);
        console.log(`Cookie config: secure=${isProduction}, sameSite=${isProduction ? 'none' : 'lax'}, partitioned=${isProduction}`);

    })
})
    .catch((error) => {
        console.error("Failed to connect to the database", error);
    })

// Sync YouTube videos every 12 hours via cron, and once on startup
cron.schedule('0 */12 * * *', () => {
    console.log('[Cron] Syncing YouTube videos...');
    syncYouTubeVideos();
});



syncYouTubeVideos();

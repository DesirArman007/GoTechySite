
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import contentRoutes from './routes/contentRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import productRoutes from './routes/productRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { generalLimiter, adminLimiter } from './middleware/rateLimiter.js';


const app = express();

// Helmet: CSP + security headers configured for Cloudinary, YouTube, and Instagram embeds
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.instagram.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://api.cloudinary.com"],
            frameSrc: ["'self'", "https://www.youtube.com", "https://www.instagram.com"],
            mediaSrc: ["'self'", "https:", "data:", "blob:"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
}));

const allowedOrigins = ['https://go-techy-site.vercel.app'];
if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:5173',
        'http://127.0.0.1:3000', 'http://127.0.0.1:5173');
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(morgan('dev'));

// Rate limiting: general (100 req/15min) on all API, stricter (30 req/15min) on admin routes
app.use('/api', generalLimiter);
app.use('/api/team', adminLimiter);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use('/api/content', contentRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/products', productRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/auth', authRoutes);

import fs from 'fs';
import path from 'path';

// Global error handler — logs to error.log and returns sanitized response in production
app.use((err, req, res, next) => {
    console.error(err.stack);

    const logPath = path.join(process.cwd(), 'error.log');
    const logMessage = `[${new Date().toISOString()}] ${err.name}: ${err.message}\n${err.stack}\n\n`;
    fs.appendFileSync(logPath, logMessage);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

export default app;

// Backend Entry Point
// TODO: Initialize Express App
// TODO: Connect to Database (require ./config/db)
// TODO: Setup Middleware (CORS, JSON)
// TODO: Register Routes
// TODO: Start Server on PORT (5000)

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

// Security Headers
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

// CORS
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'https://go-techy-site.vercel.app/',
    ],
    credentials: true
}));

// Logging
app.use(morgan('dev'));

// Rate Limiting
app.use('/api', generalLimiter);
app.use('/api/team', adminLimiter); // Stricter for sensitive routes if needed, but mainly writes are protected by auth
// Note: We apply adminLimiter specifically to write routes inside middleware if we wanted, 
// but for now general limiter on /api is good, and we rely on adminAuth for protection.

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import Routes
app.use('/api/content', contentRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/products', productRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/auth', authRoutes);

import fs from 'fs';
import path from 'path';

// Error Handler
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

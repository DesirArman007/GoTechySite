/**
 * Admin authentication middleware.
 * Protects admin routes using JWT Bearer token.
 * Token must be sent in the Authorization header: "Bearer <token>"
 */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn(`[Auth] No token provided: ${req.method} ${req.originalUrl}`);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized - No token provided'
        });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);


        req.admin = { id: decoded.id, email: decoded.email };

        console.log(`[Auth] Admin authenticated: ${decoded.email} → ${req.method} ${req.originalUrl}`);
        next();
    } catch (error) {
        console.warn(`[Auth] Invalid token: ${req.method} ${req.originalUrl} - ${error.message}`);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized - Invalid or expired token'
        });
    }
};

export { adminAuth };

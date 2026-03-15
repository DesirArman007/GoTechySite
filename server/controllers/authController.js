import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST /api/auth/login
 * Authenticate admin with email & password, return JWT
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }


        const admin = await AdminUser.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }


        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }


        const token = admin.generateToken();

        console.log(`[Auth] Admin logged in: ${admin.email}`);

        res.json({
            success: true,
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('[Auth] Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * GET /api/auth/verify
 * Verify JWT token validity
 */
export const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        // Ensure admin account hasn't been deleted since token was issued
        const admin = await AdminUser.findById(decoded.id).select('-password');
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin user no longer exists'
            });
        }

        res.json({
            success: true,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

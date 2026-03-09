import dotenv from 'dotenv';
import connectDB from './config/db.js';
import AdminUser from './models/AdminUser.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.ADMIN_EMAIL || 'abhishekyadav6502@gmail.com';
        const password = process.env.ADMIN_PASSWORD || 'GoTechy@2024';

        // Check if admin already exists
        const existing = await AdminUser.findOne({ email });
        if (existing) {
            console.log(`[Seed] Admin user already exists: ${email}`);
            process.exit(0);
        }

        await AdminUser.create({ email, password });
        console.log(`[Seed] Admin user created successfully: ${email}`);
        process.exit(0);
    } catch (error) {
        console.error('[Seed] Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();

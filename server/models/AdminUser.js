import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gotechy-jwt-secret-change-me';
const JWT_EXPIRES_IN = '24h';

const adminUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Hash password before saving
adminUserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
adminUserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
adminUserSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

export default AdminUser;

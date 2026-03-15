import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
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

// Hash password on creation or change (12 rounds of bcrypt)
adminUserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});


adminUserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


adminUserSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

export default AdminUser;

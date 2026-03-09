import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    avatar: {
        type: String
    },
    socials: {
        linkedin: String,
        twitter: String,
        instagram: String,
        github: String
    }
}, { timestamps: true });

export const TeamMember = mongoose.model('TeamMember', TeamMemberSchema);

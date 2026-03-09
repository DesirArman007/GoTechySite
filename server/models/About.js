import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    story: { type: String },
    values: [{
        title: String,
        description: String,
        icon: String
    }],
    imageUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('About', AboutSchema);

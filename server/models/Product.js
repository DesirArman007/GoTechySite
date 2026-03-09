import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    buyLink: {
        type: String
    },
    source: {
        type: String,
        required: true
    },
    pinned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Product = mongoose.model('Product', ProductSchema);

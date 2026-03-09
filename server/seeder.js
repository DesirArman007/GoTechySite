import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TeamMember } from './models/TeamMember.js';
import { Product } from './models/Product.js';
import Video from './models/Video.js';
import Post from './models/Post.js';
import About from './models/About.js';
import connectDB from './config/db.js';

dotenv.config();

const teamData = [
    {
        name: "Abhishek",
        role: "Founder & Lead Tech Reviewer",
        image: "https://picsum.photos/400/400?random=201",
        bio: "Tech enthusiast with a passion for uncovering the truth behind the specs.",
        socials: { twitter: "#", instagram: "#", linkedin: "#" }
    },
    {
        name: "Sarah Jenkins",
        role: "Video Editor & Cinematographer",
        image: "https://picsum.photos/400/400?random=202",
        bio: "The creative mind behind our cinematic shots and crisp edits.",
        socials: { instagram: "#", linkedin: "#" }
    },
    {
        name: "Rahul Sharma",
        role: "Content Strategist",
        image: "https://picsum.photos/400/400?random=203",
        bio: "Analyzes trends and plans our content roadmap.",
        socials: { twitter: "#", linkedin: "#" }
    },
    {
        name: "Emily Chen",
        role: "Web Developer",
        image: "https://picsum.photos/400/400?random=204",
        bio: "Full-stack wizard maintaining gotechy.in.",
        socials: { github: "#", twitter: "#" }
    }
];

const productData = [
    { title: 'Motorola Razr 40 Ultra', price: '$999', image: 'https://picsum.photos/500/400?random=100', description: 'The sleekest flip phone.', status: 'In Stock', source: 'amazon' },
    { title: 'Samsung Galaxy S24 Ultra', price: '$1199', image: 'https://picsum.photos/500/400?random=101', description: 'AI-powered flagship.', status: 'Best Seller', source: 'amazon' },
    { title: 'Sony WH-1000XM5', price: '$348', image: 'https://picsum.photos/500/400?random=102', description: 'Industry-leading noise canceling.', status: 'In Stock', source: 'amazon' },
    { title: 'MacBook Air 15"', price: '$1299', image: 'https://picsum.photos/500/400?random=103', description: 'Supercharged by M3.', status: 'Limited Stock', source: 'amazon' },
];

const aboutData = {
    title: "About GoTechy",
    description: "We are dedicated to simplifying technology for everyone.",
    story: "Started in 2020 as a small YouTube channel, GoTechy has grown into a trusted community of tech lovers.\n\nToday, we cover everything from smartphones to smart home devices, always keeping the 'user first' perspective.",
    imageUrl: "https://picsum.photos/800/600?random=300"
};

// Fake Videos and Posts to populate Home Page initially
const videoData = [
    { platformId: 'v1', title: 'A Good 5G Phone by Motorola', thumbnail: 'https://picsum.photos/500/300?random=3', videoUrl: '#', views: '285K', publishedAt: new Date() },
    { platformId: 'v2', title: 'GoTechy Reality - Must Watch!', thumbnail: 'https://picsum.photos/500/300?random=4', videoUrl: '#', views: '793K', publishedAt: new Date() },
    { platformId: 'v3', title: 'Lowest Priced Folding Phone!', thumbnail: 'https://picsum.photos/500/300?random=5', videoUrl: '#', views: '401K', publishedAt: new Date() },
];

const postData = [
    { platformId: 'p1', caption: 'Jai Hind Doston!', mediaUrl: 'https://picsum.photos/400/500?random=9', permalink: '#', likes: 14400, publishedAt: new Date() },
    { platformId: 'p2', caption: 'Pahle Ye Check karo', mediaUrl: 'https://picsum.photos/400/500?random=10', permalink: '#', likes: 26900, publishedAt: new Date() },
];

const importData = async () => {
    try {
        await connectDB();

        console.log('Deleting previous data...');
        await TeamMember.deleteMany();
        await Product.deleteMany();
        await About.deleteMany();
        // Optional: Clear content if you want fresh sync, but good for demo
        await Video.deleteMany();
        await Post.deleteMany();

        console.log('Importing Seed Data...');
        await TeamMember.insertMany(teamData);
        await Product.insertMany(productData);
        await About.create(aboutData);
        await Video.insertMany(videoData);
        await Post.insertMany(postData);

        console.log('Data Imported Success!');
        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

importData();

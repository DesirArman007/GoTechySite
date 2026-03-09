import "dotenv/config";
import mongoose from 'mongoose';
import { TeamMember } from './models/TeamMember.js';

mongoose.connect(process.env.MONGODB_URL)
    .then(async () => {
        console.log("Connected to DB");
        const members = await TeamMember.find({});
        console.log(JSON.stringify(members, null, 2));
        mongoose.disconnect();
    })
    .catch(err => console.error(err));

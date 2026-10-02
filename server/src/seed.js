import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Content from './models/Content.js';
import siteContent from './data/siteContent.js';

await connectDB(process.env.MONGODB_URI);
await Content.updateOne({ key: 'site' }, { key: 'site', data: siteContent }, { upsert: true });
console.log('Seeded site content.');
await mongoose.disconnect();

import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { seedProducts } from './services/catalog.js';

await connectDB(process.env.MONGODB_URI);
const added = await seedProducts();
console.log(`Seed complete: ${added} new menu item(s) added.`);
await mongoose.disconnect();

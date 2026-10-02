import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './db.js';
import { seedProducts } from './services/catalog.js';

const PORT = Number(process.env.PORT) || 5000;
const app = createApp({ clientOrigin: process.env.CLIENT_ORIGIN });

connectDB(process.env.MONGODB_URI)
  .then(async () => {
    const added = await seedProducts();
    if (added) console.log(`Seeded ${added} menu item(s).`);
  })
  .catch((err) => {
    // Keep serving: the menu falls back to bundled data and ordering returns 503.
    console.error(`MongoDB connection failed: ${err.message}`);
  });

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));

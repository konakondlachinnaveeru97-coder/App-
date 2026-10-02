import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './db.js';

const PORT = Number(process.env.PORT) || 5000;
const app = createApp({ clientOrigin: process.env.CLIENT_ORIGIN });

connectDB(process.env.MONGODB_URI).catch((err) => {
  // Keep serving: content falls back to defaults and form endpoints return 503.
  console.error(`MongoDB connection failed: ${err.message}`);
});

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));

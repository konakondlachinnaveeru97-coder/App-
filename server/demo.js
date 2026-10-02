// Runs the full app with an in-memory store instead of MongoDB, for trying the
// site without a database. Orders are lost when the process stops.
import { createApp } from './src/app.js';
import { stubDb } from './test/helpers.js';

const PORT = Number(process.env.PORT) || 5000;
stubDb();
createApp({ dbReady: () => true }).listen(PORT, () => {
  console.log(`Demo (in-memory, no MongoDB) on http://localhost:${PORT}`);
});

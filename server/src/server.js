import app from './app.js';
import env from './config/env.js';
import connectDB from './config/db.js';
import { seedOnStartup } from './services/seed.service.js';
import { startSyncJobs } from './jobs/sync.job.js';

async function start() {
  await connectDB();
  await seedOnStartup();
  startSyncJobs();

  app.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

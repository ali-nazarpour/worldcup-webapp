import cron from 'node-cron';
import env from '../config/env.js';
import { syncActiveTournament, hasActiveMatchDay } from '../services/footballSync.service.js';
import { hasFootballApiKey } from '../config/env.js';

let normalJob = null;
let activeJob = null;

export function startSyncJobs() {
  if (!env.sync.enabled || !hasFootballApiKey()) {
    if (!hasFootballApiKey()) {
      console.warn('⚠️  FOOTBALL_API_KEY not set — sync jobs disabled');
    }
    return;
  }

  normalJob = cron.schedule(env.sync.cron, async () => {
    try {
      console.log('🔄 Running scheduled sync...');
      await syncActiveTournament();
      console.log('✅ Scheduled sync completed');
    } catch (error) {
      console.error('❌ Scheduled sync failed:', error.message);
    }
  });

  activeJob = cron.schedule(env.sync.activeMatchdayCron, async () => {
    try {
      const isActiveDay = await hasActiveMatchDay();
      if (isActiveDay) {
        console.log('🔄 Running active matchday sync...');
        await syncActiveTournament();
        console.log('✅ Active matchday sync completed');
      }
    } catch (error) {
      console.error('❌ Active matchday sync failed:', error.message);
    }
  });

  console.log('✅ Sync cron jobs started');
}

export default { startSyncJobs };

import dotenv from 'dotenv';

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/worldcup_predictions',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  superAdmin: {
    fullName: process.env.SUPER_ADMIN_FULL_NAME || 'مدیر اصلی',
    username: process.env.SUPER_ADMIN_USERNAME || 'admin',
    password: process.env.SUPER_ADMIN_PASSWORD || 'change_this_password',
  },
  football: {
    provider: process.env.FOOTBALL_API_PROVIDER || 'football-data',
    baseUrl: process.env.FOOTBALL_API_BASE_URL || 'https://api.football-data.org/v4',
    apiKey: process.env.FOOTBALL_API_KEY || '',
    competitionCode: process.env.FOOTBALL_COMPETITION_CODE || 'WC',
    season: parseInt(process.env.FOOTBALL_SEASON || '2026', 10),
    timezone: process.env.FOOTBALL_DEFAULT_TIMEZONE || 'Asia/Tehran',
  },
  sync: {
    enabled: process.env.SYNC_ENABLED !== 'false',
    cron: process.env.SYNC_CRON || '*/30 * * * *',
    activeMatchdayCron: process.env.SYNC_ACTIVE_MATCHDAY_CRON || '*/5 * * * *',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
};

export function hasFootballApiKey() {
  return Boolean(env.football.apiKey && env.football.apiKey !== 'your_football_data_api_key_here');
}

export default env;

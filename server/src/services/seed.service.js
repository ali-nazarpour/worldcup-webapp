import bcrypt from 'bcryptjs';
import env from '../config/env.js';
import Tournament from '../models/Tournament.js';
import AdminUser from '../models/AdminUser.js';

export async function seedOnStartup() {
  await seedDefaultTournament();
  await seedSuperAdmin();
}

async function seedDefaultTournament() {
  const count = await Tournament.countDocuments();
  if (count > 0) return;

  await Tournament.create({
    name: 'FIFA World Cup 2026',
    year: 2026,
    competitionCode: env.football.competitionCode,
    season: env.football.season,
    apiProvider: env.football.provider,
    isActive: true,
    startDate: new Date('2026-06-11'),
    endDate: new Date('2026-07-19'),
  });

  console.log('✅ Default tournament seeded');
}

async function seedSuperAdmin() {
  const count = await AdminUser.countDocuments();
  if (count > 0) return;

  const passwordHash = await bcrypt.hash(env.superAdmin.password, 12);
  await AdminUser.create({
    fullName: env.superAdmin.fullName,
    username: env.superAdmin.username,
    passwordHash,
    role: 'SUPER_ADMIN',
    isActive: true,
  });

  console.log('✅ Super admin seeded');
}

export default { seedOnStartup };

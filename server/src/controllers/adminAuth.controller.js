import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import env from '../config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'نام کاربری و رمز عبور الزامی است.' });
  }

  const admin = await AdminUser.findOne({ username: username.toLowerCase().trim() });
  if (!admin || !admin.isActive) {
    return res.status(401).json({ success: false, message: 'نام کاربری یا رمز عبور اشتباه است.' });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ success: false, message: 'نام کاربری یا رمز عبور اشتباه است.' });
  }

  const token = jwt.sign({ id: admin._id, role: admin.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  res.cookie('admin_token', token, COOKIE_OPTIONS);
  res.json({
    success: true,
    message: 'ورود موفقیت‌آمیز بود.',
    data: {
      id: admin._id,
      fullName: admin.fullName,
      username: admin.username,
      role: admin.role,
    },
  });
}

export async function logout(req, res) {
  res.clearCookie('admin_token', COOKIE_OPTIONS);
  res.json({ success: true, message: 'خروج موفقیت‌آمیز بود.' });
}

export async function me(req, res) {
  res.json({
    success: true,
    data: {
      id: req.admin._id,
      fullName: req.admin.fullName,
      username: req.admin.username,
      role: req.admin.role,
    },
  });
}

export default { login, logout, me };

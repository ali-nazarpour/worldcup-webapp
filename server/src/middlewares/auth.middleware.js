import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import AdminUser from '../models/AdminUser.js';

export async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.admin_token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'لطفاً وارد شوید.' });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const admin = await AdminUser.findById(decoded.id).select('-passwordHash');

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'دسترسی غیرمجاز.' });
    }

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'نشست منقضی شده است.' });
  }
}

export default authMiddleware;

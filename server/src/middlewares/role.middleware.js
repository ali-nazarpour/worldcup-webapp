export function requireSuperAdmin(req, res, next) {
  if (!req.admin || req.admin.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'فقط مدیر اصلی به این بخش دسترسی دارد.' });
  }
  next();
}

export default { requireSuperAdmin };

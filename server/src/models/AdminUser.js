import mongoose from 'mongoose';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

const adminUserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ADMIN_ROLES, default: 'ADMIN' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export { ADMIN_ROLES };
export default mongoose.model('AdminUser', adminUserSchema);

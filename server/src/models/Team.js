import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    externalId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true },
    tla: { type: String, trim: true },
    logoUrl: { type: String },
    country: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Team', teamSchema);

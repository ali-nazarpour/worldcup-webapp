import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    competitionCode: { type: String, required: true, trim: true },
    season: { type: Number, required: true },
    apiProvider: { type: String, default: 'football-data' },
    isActive: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Tournament', tournamentSchema);

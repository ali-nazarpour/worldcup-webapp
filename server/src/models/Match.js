import mongoose from 'mongoose';

const MATCH_STATUSES = [
  'SCHEDULED',
  'TIMED',
  'IN_PLAY',
  'PAUSED',
  'FINISHED',
  'POSTPONED',
  'CANCELLED',
];

const matchSchema = new mongoose.Schema(
  {
    externalId: { type: Number, required: true },
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    homeScore: { type: Number, default: null },
    awayScore: { type: Number, default: null },
    status: { type: String, enum: MATCH_STATUSES, default: 'SCHEDULED' },
    utcDate: { type: Date, required: true },
    jalaliDate: { type: String },
    jalaliTime: { type: String },
    stage: { type: String },
    group: { type: String },
    venue: { type: String },
    city: { type: String },
    matchday: { type: Number },
    winner: { type: String, enum: ['HOME_TEAM', 'AWAY_TEAM', 'DRAW', null], default: null },
    lastSyncedAt: { type: Date },
    rawApiPayload: { type: mongoose.Schema.Types.Mixed },
    manualOverride: { type: Boolean, default: false },
  },
  { timestamps: true }
);

matchSchema.index({ externalId: 1, tournamentId: 1 }, { unique: true });
matchSchema.index({ tournamentId: 1, utcDate: 1 });
matchSchema.index({ status: 1 });

export { MATCH_STATUSES };
export default mongoose.model('Match', matchSchema);

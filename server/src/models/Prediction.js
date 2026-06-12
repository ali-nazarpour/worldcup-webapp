import mongoose from 'mongoose';

const PREDICTION_STATUSES = ['PENDING', 'CORRECT', 'INCORRECT'];

const predictionSchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    predictedHomeScore: { type: Number, required: true, min: 0 },
    predictedAwayScore: { type: Number, required: true, min: 0 },
    trackingCode: { type: String, required: true, unique: true },
    isCorrect: { type: Boolean, default: null },
    status: { type: String, enum: PREDICTION_STATUSES, default: 'PENDING' },
    checkedAt: { type: Date },
    actualHomeScore: { type: Number },
    actualAwayScore: { type: Number },
  },
  { timestamps: true }
);

predictionSchema.index({ matchId: 1, phoneNumber: 1 }, { unique: true });
predictionSchema.index({ phoneNumber: 1, trackingCode: 1 });
predictionSchema.index({ status: 1 });

export { PREDICTION_STATUSES };
export default mongoose.model('Prediction', predictionSchema);

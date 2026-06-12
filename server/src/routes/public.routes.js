import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { predictionLimiter } from '../middlewares/rateLimit.middleware.js';
import {
  getActiveTournamentPublic,
  getMatches,
  getMatchById,
  submitPrediction,
  trackPredictionPublic,
} from '../controllers/public.controller.js';

const router = Router();

router.get('/tournament/active', asyncHandler(getActiveTournamentPublic));
router.get('/matches', asyncHandler(getMatches));
router.get('/matches/:id', asyncHandler(getMatchById));
router.post('/predictions', predictionLimiter, asyncHandler(submitPrediction));
router.post('/predictions/track', asyncHandler(trackPredictionPublic));

export default router;

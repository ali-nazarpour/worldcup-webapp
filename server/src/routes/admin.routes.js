import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { requireSuperAdmin } from '../middlewares/role.middleware.js';
import {
  getDashboard,
  triggerSync,
  getAdminMatches,
  updateMatch,
  getAdminPredictions,
  getCorrectPredictions,
  exportCorrectPredictionsCsv,
  getTournaments,
  createTournament,
  updateTournament,
  setActiveTournament,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
} from '../controllers/admin.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', asyncHandler(getDashboard));
router.post('/sync', asyncHandler(triggerSync));
router.get('/matches', asyncHandler(getAdminMatches));
router.put('/matches/:id', asyncHandler(updateMatch));
router.get('/predictions', asyncHandler(getAdminPredictions));
router.get('/predictions/correct', asyncHandler(getCorrectPredictions));
router.get('/predictions/export/correct', asyncHandler(exportCorrectPredictionsCsv));
router.get('/tournaments', asyncHandler(getTournaments));
router.post('/tournaments', asyncHandler(createTournament));
router.put('/tournaments/:id', asyncHandler(updateTournament));
router.post('/tournaments/:id/set-active', asyncHandler(setActiveTournament));

router.get('/users', requireSuperAdmin, asyncHandler(getAdminUsers));
router.post('/users', requireSuperAdmin, asyncHandler(createAdminUser));
router.put('/users/:id', requireSuperAdmin, asyncHandler(updateAdminUser));

export default router;

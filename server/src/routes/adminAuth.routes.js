import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { loginLimiter } from '../middlewares/rateLimit.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { login, logout, me } from '../controllers/adminAuth.controller.js';

const router = Router();

router.post('/login', loginLimiter, asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', authMiddleware, asyncHandler(me));

export default router;

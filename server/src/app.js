import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import { generalLimiter } from './middlewares/rateLimit.middleware.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import publicRoutes from './routes/public.routes.js';
import adminAuthRoutes from './routes/adminAuth.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(generalLimiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'سرور فعال است.' });
});

app.use('/api/public', publicRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

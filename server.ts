import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { authRouter } from './src/server/routes/auth.routes';
import { onboardingRouter } from './src/server/routes/onboarding.routes';
import { assessmentRouter } from './src/server/routes/assessment.routes';
import { growthProfileRouter } from './src/server/routes/growth-profile.routes';
import { growthPathRouter } from './src/server/routes/growth-path.routes';
import { dashboardRouter } from './src/server/routes/dashboard.routes';
import { progressRouter } from './src/server/routes/progress.routes';
import { coachRouter } from './src/server/routes/coach.routes';
import { reportRouter } from './src/server/routes/report.routes';
import { reflectionRouter } from './src/server/routes/reflection.routes';
import { reminderRouter } from './src/server/routes/reminder.routes';
import { getDatabase } from './src/lib/db/database';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Initialize SQLite database
  await getDatabase();

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // Static uploads directory for action report images
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/onboarding', onboardingRouter);
  app.use('/api/assessment', assessmentRouter);
  app.use('/api/growth-profile', growthProfileRouter);
  app.use('/api/growth-path', growthPathRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/progress', progressRouter);
  app.use('/api/coach', coachRouter);
  app.use('/api/reports', reportRouter);
  app.use('/api/reflection', reflectionRouter);
  app.use('/api/reminders', reminderRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'NEXT YOU API' });
  });

  // Client integration
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXT YOU] Full-stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[NEXT YOU] Failed to start server:', err);
  process.exit(1);
});

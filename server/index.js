import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import creatorsRouter from './routes/creators.js';
import campaignsRouter from './routes/campaigns.js';
import fraudRouter from './routes/fraud.js';
import roiRouter from './routes/roi.js';
import contactRouter from './routes/contact.js';
import settingsRouter from './routes/settings.js';
import siteRouter from './routes/site.js';
import errorHandler from './middleware/errorHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger (dev) ──
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ── API Routes ──
app.use('/api/creators', creatorsRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/fraud', fraudRouter);
app.use('/api/roi', roiRouter);
app.use('/api/contact', contactRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/site', siteRouter);

// ── API health check ──
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    endpoints: [
      'GET  /api/creators',
      'GET  /api/creators/:handle',
      'POST /api/creators',
      'GET  /api/campaigns',
      'GET  /api/campaigns/pipeline',
      'GET  /api/campaigns/:id',
      'POST /api/campaigns',
      'PUT  /api/campaigns/:id',
      'GET  /api/fraud/signals',
      'POST /api/fraud/scan',
      'GET  /api/roi/scenarios',
      'POST /api/roi/predict',
      'POST /api/contact',
      'GET  /api/contact/submissions',
      'GET  /api/settings',
      'PUT  /api/settings/:group',
      'GET  /api/site',
    ],
  });
});

// ── API 404 catch — must come AFTER all /api routes ──
app.all('/api/{*path}', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// ── Serve static production build ──
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('/{*path}', (_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// ── Error handler ──
app.use(errorHandler);

// ── Graceful shutdown on unhandled errors ──
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err);
  process.exit(1);
});

// ── Start server ──
app.listen(PORT, () => {
  console.log('');
  console.log('  ┌──────────────────────────────────────────┐');
  console.log(`  │  🚀 PickUP API Server                    │`);
  console.log(`  │  → http://localhost:${PORT}                 │`);
  console.log(`  │  → Health: http://localhost:${PORT}/api/health│`);
  console.log('  └──────────────────────────────────────────┘');
  console.log('');
});

import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'fraud.json');

function loadFraud() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

const router = Router();

/**
 * GET /api/fraud/signals
 * Get all fraud detection signal data
 */
router.get('/signals', (req, res) => {
  const data = loadFraud();
  res.json({
    success: true,
    signals: data.signals,
    redFlags: data.redFlags,
    greenSignals: data.greenSignals,
  });
});

/**
 * POST /api/fraud/scan
 * Run a simulated fraud scan on a creator
 * Body: { handle, url? }
 */
router.post('/scan', (req, res) => {
  const { handle } = req.body;

  if (!handle) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: handle',
    });
  }

  const data = loadFraud();

  // Simulate AI fraud analysis based on handle patterns
  const isSuspicious = handle.includes('guru') || handle.includes('bot') || handle.includes('fake');
  const riskLevel = isSuspicious ? 'high' : 'low';
  const verdict = data.verdictTemplates[riskLevel];

  // Generate randomized but realistic signal scores
  const scanResults = {
    handle,
    url: req.body.url || `https://instagram.com/${handle.replace('@', '')}`,
    scanTimestamp: new Date().toISOString(),
    authenticityScore: verdict.score + Math.floor(Math.random() * 5 - 2),
    riskLevel: verdict.riskLevel,
    verdict: verdict.summary,
    badges: verdict.badges,
    signals: data.signals.map((s) => ({
      ...s,
      value: isSuspicious
        ? Math.min(100, s.value + Math.floor(Math.random() * 40 + 20))
        : s.value + Math.floor(Math.random() * 6 - 3),
    })),
    redFlags: data.redFlags,
    greenSignals: data.greenSignals,
  };

  res.json({ success: true, scan: scanResults });
});

export default router;

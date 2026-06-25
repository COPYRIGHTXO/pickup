import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadJson } from '../utils/dataStore.js';
import { supabase } from '../utils/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'fraud.json');

const EMPTY_FRAUD = {
  signals: [],
  redFlags: '',
  greenSignals: '',
  verdictTemplates: {
    low: { score: 94, riskLevel: 'Low risk', summary: 'No data available.', badges: [] },
    medium: { score: 72, riskLevel: 'Medium risk', summary: 'No data available.', badges: [] },
    high: { score: 38, riskLevel: 'High risk', summary: 'No data available.', badges: [] },
  },
};

function loadFraud() {
  return loadJson(DATA_PATH, EMPTY_FRAUD);
}

const router = Router();

/**
 * GET /api/fraud/signals
 * Get all fraud detection signal data
 */
router.get('/signals', async (req, res, next) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('fraud')
        .select('*');

      if (!error && data) {
        const signals = data.find((s) => s.key === 'signals')?.value || [];
        const redFlags = data.find((s) => s.key === 'redFlags')?.value || '';
        const greenSignals = data.find((s) => s.key === 'greenSignals')?.value || '';

        return res.json({
          success: true,
          signals,
          redFlags,
          greenSignals,
        });
      }
      console.error('[Supabase] Failed to fetch fraud signals, falling back:', error?.message);
    }

    // JSON fallback
    const data = loadFraud();
    res.json({
      success: true,
      signals: data.signals,
      redFlags: data.redFlags,
      greenSignals: data.greenSignals,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/fraud/scan
 * Run a simulated fraud scan on a creator
 * Body: { handle, url? }
 */
router.post('/scan', async (req, res, next) => {
  try {
    const { handle } = req.body;

    if (!handle) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: handle',
      });
    }

    let verdictTemplates = EMPTY_FRAUD.verdictTemplates;
    let signals = [];
    let redFlags = '';
    let greenSignals = '';

    if (supabase) {
      const { data, error } = await supabase
        .from('fraud')
        .select('*');

      if (!error && data) {
        verdictTemplates = data.find((s) => s.key === 'verdictTemplates')?.value || verdictTemplates;
        signals = data.find((s) => s.key === 'signals')?.value || [];
        redFlags = data.find((s) => s.key === 'redFlags')?.value || '';
        greenSignals = data.find((s) => s.key === 'greenSignals')?.value || '';
      } else if (error) {
        console.error('[Supabase] Failed to fetch templates for scan, falling back:', error.message);
      }
    }

    // If supabase was not configured or fetch failed, load from local file
    if (!supabase || signals.length === 0) {
      const localData = loadFraud();
      verdictTemplates = localData.verdictTemplates || verdictTemplates;
      signals = localData.signals || [];
      redFlags = localData.redFlags || '';
      greenSignals = localData.greenSignals || '';
    }

    // Simulate AI fraud analysis based on handle patterns
    const isSuspicious = handle.includes('guru') || handle.includes('bot') || handle.includes('fake');
    const riskLevel = isSuspicious ? 'high' : 'low';
    const verdict = verdictTemplates[riskLevel] || EMPTY_FRAUD.verdictTemplates[riskLevel];

    // Generate randomized but realistic signal scores
    const scanResults = {
      handle,
      url: req.body.url || `https://instagram.com/${handle.replace('@', '')}`,
      scanTimestamp: new Date().toISOString(),
      authenticityScore: Math.max(0, Math.min(100, verdict.score + Math.floor(Math.random() * 5 - 2))),
      riskLevel: verdict.riskLevel,
      verdict: verdict.summary,
      badges: verdict.badges,
      signals: signals.map((s) => ({
        ...s,
        value: Math.max(0, Math.min(100,
          isSuspicious
            ? s.value + Math.floor(Math.random() * 40 + 20)
            : s.value + Math.floor(Math.random() * 6 - 3)
        )),
      })),
      redFlags,
      greenSignals,
    };

    res.json({ success: true, scan: scanResults });
  } catch (err) {
    next(err);
  }
});

export default router;

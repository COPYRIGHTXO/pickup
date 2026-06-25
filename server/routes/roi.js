import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadJson } from '../utils/dataStore.js';
import { supabase } from '../utils/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'roi.json');

const EMPTY_ROI = {
  scenarios: [],
  defaultInputs: {},
  predictionEngine: {},
  recommendations: '',
};

function loadRoi() {
  return loadJson(DATA_PATH, EMPTY_ROI);
}

const router = Router();

/**
 * GET /api/roi/scenarios
 * Get default ROI scenarios and prediction engine data
 */
router.get('/scenarios', async (req, res, next) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('roi')
        .select('*');

      if (!error && data) {
        const scenarios = data.find((s) => s.key === 'scenarios')?.value || [];
        const defaultInputs = data.find((s) => s.key === 'defaultInputs')?.value || {};
        const predictionEngine = data.find((s) => s.key === 'predictionEngine')?.value || {};
        const recommendations = data.find((s) => s.key === 'recommendations')?.value || '';

        return res.json({
          success: true,
          scenarios,
          defaultInputs,
          predictionEngine,
          recommendations,
        });
      }
      console.error('[Supabase] Failed to fetch ROI scenarios, falling back:', error?.message);
    }

    // JSON fallback
    const data = loadRoi();
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/roi/predict
 * Calculate ROI prediction from campaign parameters
 * Body: { creators, fees, followers, productPrice, conversionRate, duration }
 */
router.post('/predict', async (req, res, next) => {
  try {
    const {
      creators = 8,
      fees = 72000,
      followers = 3800000,
      productPrice = 48,
      conversionRate = 2.4,
      duration = 21,
    } = req.body;

    // Validate numeric inputs
    const numCreators = Math.max(0, Number(creators) || 0);
    const numFees = Math.max(0, Number(fees) || 0);
    const numFollowers = Math.max(0, Number(followers) || 0);
    const numPrice = Math.max(0, Number(productPrice) || 0);
    const numConversion = Math.max(0, Math.min(100, Number(conversionRate) || 0));
    const numDuration = Math.max(1, Number(duration) || 1);

    // Simulated ROI calculation engine
    const engagementRate = 0.058; // average 5.8%
    const totalReach = numFollowers * (numDuration / 7) * 0.35;
    const clicks = Math.round(totalReach * engagementRate);
    const conversions = Math.round(clicks * (numConversion / 100));
    const revenue = conversions * numPrice;
    const profit = revenue - numFees;
    const roas = numFees > 0 ? (revenue / numFees).toFixed(1) : '0.0';

    // Generate three scenarios with variance
    const scenarios = [
      {
        name: 'Conservative',
        reach: formatNum(totalReach * 0.65),
        revenue: formatCurrency(revenue * 0.55),
        roi: `${(Number(roas) * 0.58).toFixed(1)}x`,
      },
      {
        name: 'Expected',
        reach: formatNum(totalReach),
        revenue: formatCurrency(revenue),
        roi: `${roas}x`,
      },
      {
        name: 'Optimistic',
        reach: formatNum(totalReach * 1.45),
        revenue: formatCurrency(revenue * 1.58),
        roi: `${(Number(roas) * 1.45).toFixed(1)}x`,
      },
    ];

    const prediction = {
      reach: formatNum(totalReach),
      clicks: formatNum(clicks),
      conversions: conversions.toLocaleString(),
      profit: formatCurrency(profit),
      roas: `${roas}x`,
    };

    let recommendations = '';
    if (supabase) {
      const { data: recData, error } = await supabase
        .from('roi')
        .select('value')
        .eq('key', 'recommendations')
        .maybeSingle();

      if (!error && recData) {
        recommendations = recData.value;
      }
    }

    if (!recommendations) {
      recommendations = loadRoi().recommendations;
    }

    res.json({
      success: true,
      inputs: {
        creators: numCreators,
        fees: numFees,
        followers: numFollowers,
        productPrice: numPrice,
        conversionRate: numConversion,
        duration: numDuration,
      },
      scenarios,
      prediction,
      recommendations,
    });
  } catch (err) {
    next(err);
  }
});

function formatNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(Math.round(n));
}

function formatCurrency(n) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n)}`;
}

export default router;

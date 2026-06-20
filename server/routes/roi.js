import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'roi.json');

function loadRoi() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

const router = Router();

/**
 * GET /api/roi/scenarios
 * Get default ROI scenarios and prediction engine data
 */
router.get('/scenarios', (req, res) => {
  const data = loadRoi();
  res.json({ success: true, ...data });
});

/**
 * POST /api/roi/predict
 * Calculate ROI prediction from campaign parameters
 * Body: { creators, fees, followers, productPrice, conversionRate, duration }
 */
router.post('/predict', (req, res) => {
  const {
    creators = 8,
    fees = 72000,
    followers = 3800000,
    productPrice = 48,
    conversionRate = 2.4,
    duration = 21,
  } = req.body;

  // Simulated ROI calculation engine
  const engagementRate = 0.058; // average 5.8%
  const totalReach = followers * (duration / 7) * 0.35;
  const clicks = Math.round(totalReach * engagementRate);
  const conversions = Math.round(clicks * (conversionRate / 100));
  const revenue = conversions * productPrice;
  const profit = revenue - fees;
  const roas = fees > 0 ? (revenue / fees).toFixed(1) : 0;

  // Generate three scenarios with variance
  const scenarios = [
    {
      name: 'Conservative',
      reach: formatNum(totalReach * 0.65),
      revenue: formatCurrency(revenue * 0.55),
      roi: `${(roas * 0.58).toFixed(1)}x`,
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
      roi: `${(roas * 1.45).toFixed(1)}x`,
    },
  ];

  const prediction = {
    reach: formatNum(totalReach),
    clicks: formatNum(clicks),
    conversions: conversions.toLocaleString(),
    profit: formatCurrency(profit),
    roas: `${roas}x`,
  };

  res.json({
    success: true,
    inputs: { creators, fees, followers, productPrice, conversionRate, duration },
    scenarios,
    prediction,
    recommendations: loadRoi().recommendations,
  });
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

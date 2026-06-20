import { Router } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAMPAIGN_PATH = join(__dirname, '..', 'data', 'campaigns.json');
const PIPELINE_PATH = join(__dirname, '..', 'data', 'pipeline.json');

function loadCampaigns() {
  return JSON.parse(readFileSync(CAMPAIGN_PATH, 'utf-8'));
}

function saveCampaigns(data) {
  writeFileSync(CAMPAIGN_PATH, JSON.stringify(data, null, 2));
}

function loadPipeline() {
  return JSON.parse(readFileSync(PIPELINE_PATH, 'utf-8'));
}

const router = Router();

/**
 * GET /api/campaigns
 * List all campaigns
 */
router.get('/', (req, res) => {
  const data = loadCampaigns();
  res.json({ success: true, ...data });
});

/**
 * GET /api/campaigns/pipeline
 * Get the Kanban pipeline data
 */
router.get('/pipeline', (req, res) => {
  const data = loadPipeline();
  res.json({ success: true, ...data });
});

/**
 * GET /api/campaigns/:id
 * Get a single campaign by ID
 */
router.get('/:id', (req, res) => {
  const data = loadCampaigns();
  const campaign = data.campaigns.find((c) => c.id === req.params.id);

  if (!campaign) {
    return res.status(404).json({ success: false, error: 'Campaign not found' });
  }

  res.json({ success: true, campaign });
});

/**
 * POST /api/campaigns
 * Create a new campaign
 * Body: { name, budget, creators, brand }
 */
router.post('/', (req, res) => {
  const { name, budget, brand } = req.body;

  if (!name || !budget) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, budget',
    });
  }

  const data = loadCampaigns();

  const newCampaign = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    status: 'Active',
    budget,
    budgetNum: parseInt(budget.replace(/[^0-9]/g, ''), 10) || 0,
    creators: req.body.creators || 0,
    roi: 'Pending',
    due: req.body.due || 'TBD',
    brand: brand || 'Unknown',
    createdAt: new Date().toISOString().split('T')[0],
  };

  data.campaigns.push(newCampaign);
  saveCampaigns(data);

  res.status(201).json({ success: true, campaign: newCampaign });
});

/**
 * PUT /api/campaigns/:id
 * Update a campaign's status or other fields
 * Body: any campaign fields to update
 */
router.put('/:id', (req, res) => {
  const data = loadCampaigns();
  const idx = data.campaigns.findIndex((c) => c.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Campaign not found' });
  }

  data.campaigns[idx] = { ...data.campaigns[idx], ...req.body };
  saveCampaigns(data);

  res.json({ success: true, campaign: data.campaigns[idx] });
});

export default router;
